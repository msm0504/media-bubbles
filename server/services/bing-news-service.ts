import { NewsSearchResponse, NewsArticle } from '@azure/cognitiveservices-newssearch/esm/models';

import { MILLISECONDS_IN_FIFTEEN_MIN } from '../constants';
import formatGetQuery from '../util/format-get-query';
import { getBiasRatingBySourceId, getSourceLists } from './source-list-service';
import type { ArticleMap, Source, SearchRequest, NewsApiArticle } from '@/types';

type QuerySource = Source[] | string;
type QuerySources = QuerySource[];

const MAX_BING_RESULTS = 100;
const MAX_SHOW_PER_CATEGORY = 10;
const headers = {
	Accept: 'application/json',
	'Ocp-Apim-Subscription-Key': process.env.BING_NEWS_API_KEY || ''
};
const DEFAULT_PARAMS = { setLang: 'en', count: MAX_BING_RESULTS };
const DEFAULT_PREVIOUS_DAYS = 5;

global.latest = global.latest || { lastUpdate: 0 };

async function getNewsArticles(
	sources: Source[] | string,
	keyword: string,
	previousDays: number,
	appSourcesById: Record<string, Source>
): Promise<NewsSearchResponse> {
	const siteFilters = Array.isArray(sources)
		? `(${sources.map(({ url }) => `site:${url}`).join(' | ')})`
		: `site:${appSourcesById[sources].url}`;
	const query = `${keyword ? `${keyword.replace(/\s/g, '+')}+` : ''}${siteFilters}`;
	const params: Record<string, string | number> = { q: query, ...DEFAULT_PARAMS };

	if (keyword) {
		const fromDate = new Date();
		fromDate.setDate(fromDate.getDate() - (previousDays || DEFAULT_PREVIOUS_DAYS));
		fromDate.setHours(0, 0, 0, 0);
		params.since = fromDate.getTime();
	}

	const requestOptions = { method: 'GET', headers };
	const response = await fetch(
		`${process.env.BING_NEWS_API_URL}${formatGetQuery(params)}`,
		requestOptions
	);
	return response.json();
}

const isArticleOnTopic = (article: NewsArticle, keyword = '') =>
	!keyword ||
	article.name?.toLowerCase().includes(keyword.toLowerCase()) ||
	article.description?.toLowerCase().includes(keyword.toLowerCase());

const getArticlesToShow = (
	articles: NewsArticle[],
	keyword = '',
	sources: QuerySource,
	appSourcesById: Record<string, Source>
): NewsApiArticle[] => {
	const articlesToShow: NewsApiArticle[] = [];
	for (let i = 0; i < articles.length && articlesToShow.length < MAX_SHOW_PER_CATEGORY; i++) {
		const article = articles[i];

		if (!isArticleOnTopic(article, keyword)) continue;

		let articleSource;
		if (Array.isArray(sources)) {
			const articleDomain = new URL(article.url || '').hostname;
			articleSource = sources.find(({ url }) => articleDomain.includes(url));
		} else {
			articleSource = appSourcesById[sources];
		}

		articlesToShow.push({
			source: {
				id: articleSource?.id || '',
				name: articleSource?.name || ''
			},
			title: article.name || '',
			description: article.description || '',
			url: article.url || '',
			publishedAt: article.datePublished || '',
			urlToImage: article.image?.thumbnailUrl
		});
	}
	return articlesToShow;
};

const sortArticlesFromMultiSources = (articles: NewsArticle[]): NewsArticle[] => {
	const sourceArticleCounts: Record<string, number> = {};
	const articlesByCount: NewsArticle[][] = [];

	for (let i = 0; i < articles.length; i++) {
		const article = articles[i];
		const domainParts = new URL(article.url || '').hostname.split('.');
		const rootDomain = `${domainParts[domainParts.length - 2]}.${
			domainParts[domainParts.length - 1]
		}`;

		const index = sourceArticleCounts[rootDomain] || 0;
		if (!sourceArticleCounts[rootDomain]) {
			sourceArticleCounts[rootDomain] = 1;
		} else {
			sourceArticleCounts[rootDomain]++;
		}

		if (!articlesByCount[index]) {
			articlesByCount[index] = [];
		}
		articlesByCount[index].push(article);
	}

	return articlesByCount.flat();
};

export async function getHeadlines(params: SearchRequest): Promise<ArticleMap> {
	if (!params || (!params.sources && params.spectrumSearchAll !== 'Y')) {
		return {};
	}
	const { appSourceList, sourceListBySlant } = await getSourceLists();
	const appSourcesById = appSourceList.reduce((acc: Record<string, Source>, appSource) => {
		acc[appSource.id] = appSource;
		return acc;
	}, {});
	const isSpectrumSearch = !params.sources && params.spectrumSearchAll === 'Y';
	const sources: QuerySources = isSpectrumSearch ? sourceListBySlant : params.sources.split(',');

	return sources.reduce<Promise<ArticleMap>>(async function (
		memo: Promise<ArticleMap>,
		sources: QuerySource
	) {
		let { value } = await getNewsArticles(
			sources,
			params.keyword,
			+params.previousDays,
			appSourcesById
		);
		const acc = await memo;
		const key = Array.isArray(sources) ? getBiasRatingBySourceId(sources[0].id) : sources;
		if (value.length) {
			if (isSpectrumSearch) {
				value = sortArticlesFromMultiSources(value);
			}
			acc[key] = getArticlesToShow(value, params.keyword, sources, appSourcesById);
		} else {
			acc[key] = [];
		}
		return acc;
	},
	Promise.resolve({}));
}

export async function getLatestHeadlines(): Promise<ArticleMap> {
	const headlinesAreOld = Date.now() - MILLISECONDS_IN_FIFTEEN_MIN > global.latest.lastUpdate;
	if (!global.latest.articleMap || headlinesAreOld) {
		const params: SearchRequest = {
			sources: '',
			spectrumSearchAll: 'Y',
			keyword: '',
			previousDays: 1
		};
		// remove any undefined field values
		global.latest.articleMap = JSON.parse(JSON.stringify(await getHeadlines(params)));
		global.latest.lastUpdate = Date.now();
	}
	return global.latest.articleMap;
}
