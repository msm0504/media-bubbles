import type { AtUriString, DidString } from '@atproto/lex';
import { app } from '@bsky/sdk/lexicons';
import { getBskyNewsListUri } from './bsky-list.service';
import { getSourceLists } from './source-list-service';
import { getBskyPublicAgent } from '@/connections/bsky-agent';
import type { BskyArticle, Source } from '@/types';
import { getCollection } from '@/connections/db-connection';
import { isSimilar } from '@/util/string-similarity';

type PostRecord = { text?: string };
type IsUniquePostParams = {
	post: BskyArticle;
	uniquePosts: BskyArticle[];
	uniqueIds: Set<string>;
	uniqueTitles: string[];
	uniqueDescs: string[];
};
type LoadRecentPostsParams = {
	loadAllSources?: boolean;
	source?: Source;
	previousValue: number;
	previousUnit: 'minutes' | 'hours' | 'days';
};
type GetPostsResp = {
	feed: app.bsky.feed.defs.FeedViewPost[];
	cursor?: string | undefined;
};

const COLLECTION_NAME = 'bsky_posts';
const MAX_BSKY_RESULTS = 50;
// Based on https://www.freecodecamp.org/news/how-to-write-a-regular-expression-for-a-url/
const URL_REGEX =
	/((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?\/[a-zA-Z0-9]{2,})/;

const _collection = getCollection<BskyArticle>(COLLECTION_NAME);

const getSourcePosts = async (handle: string, cursor: string) => {
	const agent = getBskyPublicAgent();
	const params = {
		actor: handle as DidString,
		limit: MAX_BSKY_RESULTS,
		includePins: false,
		cursor,
	};
	try {
		return agent.call(app.bsky.feed.getAuthorFeed, params);
	} catch (error) {
		console.error(`${handle}: ${error}`);
		return { feed: [] };
	}
};

const getPostsFromAllSources = async (cursor: string) => {
	const agent = getBskyPublicAgent();
	const listUri = (await getBskyNewsListUri()) as AtUriString;
	try {
		return agent.call(app.bsky.feed.getListFeed, {
			list: listUri,
			limit: MAX_BSKY_RESULTS,
			cursor,
		});
	} catch (error) {
		console.error(`${listUri}: ${error}`);
		return { feed: [] };
	}
};

const formatPost = (
	post: app.bsky.feed.defs.PostView,
	postSource: Source
): BskyArticle | undefined => {
	const rkey = post.uri.substring(post.uri.lastIndexOf('/') + 1);

	if ((post.embed?.$type || '') === 'app.bsky.embed.external#view') {
		const embed = post.embed as app.bsky.embed.external.View;
		const external = embed?.external;
		return {
			_id: rkey,
			sourceId: postSource.id,
			sourceName: postSource.name,
			slant: postSource.slant,
			title: external.title,
			description: external.description || (post.record as PostRecord)?.text || '',
			url: external.uri,
			publishedAt: new Date(post.indexedAt),
		};
	} else if ((post.record as PostRecord)?.text) {
		const textWithUrl = ((post.record as PostRecord).text || '').split(URL_REGEX, 2);
		const text = textWithUrl[0]?.trim() || '';
		const url = textWithUrl[1]?.startsWith('http')
			? textWithUrl[1] || ''
			: `https://${textWithUrl[1]}`;
		return {
			_id: rkey,
			sourceId: postSource.id,
			sourceName: postSource.name,
			slant: postSource.slant,
			description: text,
			url: url,
			publishedAt: new Date(post.indexedAt),
		};
	}
};

const isUniquePost = ({
	post,
	uniquePosts,
	uniqueIds,
	uniqueTitles,
	uniqueDescs,
}: IsUniquePostParams) => {
	if (!uniquePosts.length) return true;

	try {
		const hasUniqueTitle =
			!post.title || !uniqueTitles.length || !isSimilar(post.title, uniqueTitles);
		const hasUniqueDesc =
			!post.description || !uniqueDescs.length || !isSimilar(post.description, uniqueDescs);

		return !uniqueIds.has(post._id.toString()) && hasUniqueTitle && hasUniqueDesc;
	} catch (error) {
		console.error(error);
		return true;
	}
};

const loadRecentPosts = async ({
	loadAllSources = false,
	previousUnit,
	previousValue,
	source,
}: LoadRecentPostsParams) => {
	if (!loadAllSources && !source?.bskyHandle) return;

	const uniquePosts: BskyArticle[] = [];
	const uniqueIds: Set<string> = new Set();
	const uniqueTitles: string[] = [];
	const uniqueDescs: string[] = [];

	const { appSourceList } = await getSourceLists();
	const sourcesByBskyId = appSourceList.reduce(
		(acc, source) => {
			if (source.bskyDid) {
				acc[source.bskyDid] = source;
			}
			return acc;
		},
		{} as { [name: string]: Source }
	);

	const minDate = new Date();
	switch (previousUnit) {
		case 'minutes':
			minDate.setMinutes(minDate.getMinutes() - previousValue);
			break;
		case 'hours':
			minDate.setHours(minDate.getHours() - previousValue);
			break;
		case 'days':
			minDate.setDate(minDate.getDate() - previousValue);
			break;
	}
	const minTs = minDate.getTime();
	let cursor: string | undefined = new Date().toISOString();

	while (cursor && new Date(cursor).getTime() > minTs) {
		const data: GetPostsResp = await (loadAllSources
			? getPostsFromAllSources(cursor)
			: getSourcePosts(source?.bskyHandle || '', cursor));
		data.feed.forEach(({ post }) => {
			const postSource = source || sourcesByBskyId[post.author.did];
			const formatted = formatPost(post, postSource);
			if (
				formatted &&
				isUniquePost({ post: formatted, uniquePosts, uniqueIds, uniqueTitles, uniqueDescs })
			) {
				uniqueIds.add(formatted._id.toString());
				if (formatted.title) {
					uniqueTitles.push(formatted.title);
				}
				if (formatted.description) {
					uniqueDescs.push(formatted.description);
				}
				uniquePosts.push(formatted);
			}
		});
		cursor = data.cursor;
	}

	const db = await _collection;
	await db.insertMany(uniquePosts);
};

export const loadPostsForNewSource = (source: Source) =>
	loadRecentPosts({ source, previousUnit: 'days', previousValue: 7 });
export const loadRecentPostsForAllSources = () =>
	loadRecentPosts({ loadAllSources: true, previousUnit: 'minutes', previousValue: 15 });

export const updateSlantForSourcePosts = async (source: Source) => {
	const db = await _collection;
	await db.updateMany({ sourceId: source.id }, { $set: { slant: source.slant } });
};

export const deleteSourcePosts = async (sourceId: string) => {
	const db = await _collection;
	await db.deleteMany({ sourceId: sourceId });
};
