import { MILLISECONDS_IN_DAY } from '../constants';
import formatGetQuery from '../util/format-get-query';
import { getBiasRatingBySourceId, getSourceLists } from './source-list-service';
import { ArticleMap, Source, SearchRequest, TwitterArticle } from '../../types';

type UserExpansion = {
	id: string;
	name: string;
	username: string;
};

type MetaData = {
	newest_id: string;
	oldest_id: string;
	result_count: number;
	next_token: string;
};

type TwitterNewsResponse = {
	data: TwitterArticle[];
	meta: MetaData;
	includes: { users: UserExpansion[] };
};

type QuerySource = Source[] | string;
type QuerySources = QuerySource[];

const MAX_TWITTER_RESULTS = 100;
const MAX_SHOW_PER_CATEGORY = 10;
const headers = {
	Accept: 'application/json',
	Authorization: `Bearer ${process.env.TWITTER_APP_BEARER}`
};
const defaultParams = { max_results: MAX_TWITTER_RESULTS, expansions: 'author_id' };
const defaultOperators = 'has:links -is:retweet';
const DEFAULT_PREVIOUS_DAYS = 5;

const filterDupeTweets = (data: TwitterArticle[]): TwitterArticle[] => {
	const uniqueTweets: { [name: string]: TwitterArticle } = {};
	let uniqueCount = 0;
	for (let i = 0; i < data.length && uniqueCount < MAX_SHOW_PER_CATEGORY; i++) {
		const { text } = data[i];
		const linkIndex = text.indexOf('http');
		if (linkIndex > -1) {
			const withoutLinks = text.substring(0, linkIndex).trim().replace(/\s+/g, ' ').toLowerCase();
			if (!uniqueTweets[withoutLinks]) {
				uniqueTweets[withoutLinks] = data[i];
				uniqueCount++;
			}
		}
	}
	return Object.values(uniqueTweets);
};

const addAnchorsToText = (text: string) =>
	text.replace(
		/(http?s:\/\/\S+)/g,
		'<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
	);

const getSourceName = (
	tweet: TwitterArticle,
	users: UserExpansion[],
	appSourceList: Source[]
): string => {
	const twitterHandle = users.find(({ id }) => id === tweet.author_id)?.username;
	return appSourceList.find(({ id }) => id === twitterHandle)?.name ?? '';
};

export async function getHeadlines(params: SearchRequest): Promise<ArticleMap> {
	if (!params || (!params.sources && params.spectrumSearchAll !== 'Y')) {
		return {};
	}
	const { appSourceList, sourceListBySlant } = await getSourceLists();
	const isSpectrumSearch = !params.sources && params.spectrumSearchAll === 'Y';
	const sources: QuerySources = isSpectrumSearch ? sourceListBySlant : params.sources.split(',');

	return sources.reduce<Promise<ArticleMap>>(async function (memo, sources: QuerySource) {
		const { meta, data, includes }: TwitterNewsResponse = await getRecentTweets(
			sources,
			params.keyword,
			+params.previousDays
		);
		const acc = await memo;
		if (meta.result_count) {
			const { users } = includes;
			const key = isSpectrumSearch ? getBiasRatingBySourceId(users[0].username) : users[0].username;
			acc[key] = filterDupeTweets(data).map(tweet => ({
				...tweet,
				text: addAnchorsToText(tweet.text),
				sourceName: getSourceName(tweet, users, appSourceList)
			}));
		} else {
			const key = Array.isArray(sources) ? getBiasRatingBySourceId(sources[0].id) : sources;
			acc[key] = [];
		}
		return acc;
	}, new Promise(resolve => resolve({})));
}

async function getRecentTweets(sources: Source[] | string, keyword: string, previousDays: number) {
	const fromFilters = Array.isArray(sources)
		? `(${sources.map(({ id }) => `from:${id}`).join(' OR ')})`
		: `from:${sources}`;
	const query = `${keyword ? `${keyword} ` : ''}${fromFilters} ${defaultOperators}`;
	const params: Record<string, string | number> = { query, ...defaultParams };

	if (keyword) {
		const fromDate = new Date(
			Date.now() - MILLISECONDS_IN_DAY * ((previousDays || DEFAULT_PREVIOUS_DAYS) - 1)
		);
		fromDate.setHours(0, 0, 0);
		params.start_time = fromDate.toISOString();
	}

	const requestOptions = { method: 'GET', headers };
	const response = await fetch(
		`${process.env.TWITTER_POST_API_URL}${formatGetQuery(params)}`,
		requestOptions
	);
	return response.json();
}
