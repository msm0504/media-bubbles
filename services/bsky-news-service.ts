import type { AppBskyFeedDefs } from '@atproto/api';
import type { ViewExternal } from '@atproto/api/dist/client/types/app/bsky/embed/external';
import { findBestMatch } from 'string-similarity';
import { getBskyAgent, getBskyPublicAgent } from './bsky-agent';
import { getBskyListUriForSlant } from './bsky-list-service';
import { getSourceLists } from './source-list-service';
import type { Article, ArticleMap, SearchRequest, Source } from '@/types';
import { type SourceSlant, SOURCE_SLANT_MAP } from '@/constants/source-slant';

type GetArticlesToShowParams = {
	posts: AppBskyFeedDefs.PostView[];
	source?: Source;
	slantSources?: Source[];
};

type PostRecord = { text?: string };

const DEFAULT_PREVIOUS_DAYS = 5;
const MAX_BSKY_RESULTS = 25;
const MAX_BSKY_PROFILES = 5;
const USE_SECOND_PROFILE = ['slate', 'bbc news'];
const MAX_SHOW_PER_CATEGORY = 10;
const MAX_SIMILARITY_SCORE = 0.8;
const BSKY_ARTICLE_TYPE = 'app.bsky.embed.external#view';
// Based on https://www.freecodecamp.org/news/how-to-write-a-regular-expression-for-a-url/
const URL_REGEX =
	/((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?\/[a-zA-Z0-9]{2,})/;

export const getBskyProfile = async (sourceName: string, url: string) => {
	const agent = getBskyPublicAgent();
	const profileIndex = USE_SECOND_PROFILE.includes(sourceName.toLowerCase()) ? 1 : 0;
	const urlResp = await agent.searchActorsTypeahead({ q: url, limit: MAX_BSKY_PROFILES });
	if (urlResp?.data?.actors.length) {
		return urlResp.data.actors[profileIndex];
	}
	const nameResp = await agent.searchActorsTypeahead({ q: sourceName, limit: MAX_BSKY_PROFILES });
	return nameResp?.data?.actors[profileIndex];
};

const getSourcePosts = async (handle: string) => {
	const agent = getBskyPublicAgent();
	const params = { actor: handle, limit: MAX_BSKY_RESULTS, includePins: false };
	const resp = await agent.getAuthorFeed(params);
	return resp.data.feed.map(({ post }) => post) || [];
};

const getSourcePostsByKeyword = async (
	handle: string,
	keyword: string,
	previousDays: number
): Promise<AppBskyFeedDefs.PostView[]> => {
	const agent = await getBskyAgent();
	const fromDate = new Date();
	fromDate.setDate(fromDate.getDate() - (previousDays || DEFAULT_PREVIOUS_DAYS));
	fromDate.setHours(0, 0, 0, 0);
	const params = {
		q: keyword,
		since: fromDate.toISOString(),
		author: handle,
		limit: MAX_BSKY_RESULTS,
	};
	const resp = await agent.app.bsky.feed.searchPosts(params);
	return resp.data.posts || [];
};

const getListPosts = async (slant: SourceSlant) => {
	const agent = getBskyPublicAgent();
	const listUri = getBskyListUriForSlant(slant);
	const params = { list: listUri, limit: MAX_BSKY_RESULTS };
	const resp = await agent.app.bsky.feed.getListFeed(params);
	return resp.data.feed.map(({ post }) => post) || [];
};

const getListPostsByKeyword = async (sources: Source[], keyword: string, previousDays: number) => {
	const posts = await Promise.all(
		sources.map(({ bskyHandle }) =>
			bskyHandle ? getSourcePostsByKeyword(bskyHandle, keyword, previousDays) : Promise.resolve([])
		)
	);
	return posts
		.flat()
		.sort((a, b) => new Date(b.indexedAt).getTime() - new Date(a.indexedAt).getTime());
};

const sortPostsFromMultiSources = (
	posts: AppBskyFeedDefs.PostView[]
): AppBskyFeedDefs.PostView[] => {
	const sourcePostCounts: Record<string, number> = {};
	const postsByCount: AppBskyFeedDefs.PostView[][] = [];

	for (let i = 0; i < posts.length; i++) {
		const post = posts[i];
		const { did } = post.author;

		const index = sourcePostCounts[did] || 0;
		if (!sourcePostCounts[did]) {
			sourcePostCounts[did] = 1;
		} else {
			sourcePostCounts[did]++;
		}

		if (!postsByCount[index]) {
			postsByCount[index] = [];
		}
		postsByCount[index].push(post);
	}

	return postsByCount.flat();
};

const getArticlesToShow = ({ posts, source, slantSources }: GetArticlesToShowParams): Article[] => {
	const articlesToShow: Article[] = [];
	const uniqueTexts: string[] = [];
	const uniqueTitles: string[] = [];
	for (let i = 0; i < posts.length && articlesToShow.length < MAX_SHOW_PER_CATEGORY; i++) {
		const post = posts[i];
		const postSource =
			source || (slantSources?.find(({ bskyDid }) => bskyDid === post.author.did) as Source);

		if (!postSource) continue;

		if ((post.embed?.$type || '') === BSKY_ARTICLE_TYPE) {
			const external = post.embed?.external as ViewExternal;
			if (
				!uniqueTitles.length ||
				findBestMatch(external.title, uniqueTitles).bestMatch.rating < MAX_SIMILARITY_SCORE
			) {
				uniqueTitles.push(external.title);
				const article = external.title
					? {
							source: {
								id: postSource.id,
								name: postSource.name,
							},
							title: external.title || '',
							description: external.description || '',
							url: external.uri || '',
							publishedAt: post.indexedAt || '',
						}
					: (post.record as PostRecord)?.text
						? {
								id: post.uri,
								sourceName: postSource.name,
								url: external.uri,
								text: (post.record as PostRecord).text || '',
							}
						: null;
				if (article) articlesToShow.push(article);
			}
		} else if ((post.record as PostRecord)?.text) {
			const textWithUrl = ((post.record as PostRecord).text || '').split(URL_REGEX, 2);
			const text = textWithUrl[0].trim();
			if (
				textWithUrl[1] &&
				(!uniqueTexts.length ||
					findBestMatch(text, uniqueTexts).bestMatch.rating < MAX_SIMILARITY_SCORE)
			) {
				const url = textWithUrl[1].startsWith('http')
					? textWithUrl[1]
					: `https://${textWithUrl[1]}`;
				uniqueTexts.push(text);
				articlesToShow.push({
					id: post.uri,
					sourceName: postSource.name,
					text,
					url,
				});
			}
		}
	}
	return articlesToShow;
};

export const getHeadlines = async (params: SearchRequest): Promise<ArticleMap> => {
	if (!params || (!params.sources && params.spectrumSearchAll !== 'Y')) {
		return {};
	}
	const { appSourceList, sourceListBySlant } = await getSourceLists();
	const appSourcesById = appSourceList.reduce((acc: Record<string, Source>, appSource) => {
		acc[appSource.id] = appSource;
		return acc;
	}, {});
	const isSpectrumSearch = !params.sources && params.spectrumSearchAll === 'Y';

	return isSpectrumSearch
		? Object.keys(SOURCE_SLANT_MAP).reduce<Promise<ArticleMap>>(
				async (memo: Promise<ArticleMap>, slantKey: string) => {
					const slant = Number(slantKey) as SourceSlant;
					const slantSources = sourceListBySlant[slant];
					const posts = await (params.keyword
						? getListPostsByKeyword(slantSources, params.keyword, params.previousDays)
						: getListPosts(slant));
					const acc = await memo;
					acc[slant] = getArticlesToShow({ posts: sortPostsFromMultiSources(posts), slantSources });
					return acc;
				},
				Promise.resolve({})
			)
		: params.sources
				.split(',')
				.reduce<Promise<ArticleMap>>(async (memo: Promise<ArticleMap>, sourceId: string) => {
					const source = appSourcesById[sourceId];
					const handle = source.bskyHandle || '';
					const posts = await (params.keyword
						? getSourcePostsByKeyword(handle, params.keyword, params.previousDays)
						: getSourcePosts(handle));
					const acc = await memo;
					acc[sourceId] = getArticlesToShow({ posts, source });
					return acc;
				}, Promise.resolve({}));
};
