import { getCollection } from './db-connection';
import type { ArticleMap, BskyArticle, SearchRequest } from '@/types';
import { type SourceSlant, SOURCE_SLANT_MAP } from '@/constants/source-slant';

const DEFAULT_PREVIOUS_DAYS = 5;
const MAX_SLANT_RESULTS = 50;
const MAX_SHOW_PER_CATEGORY = 10;
const COLLECTION_NAME = 'bsky_posts';
const _collection = getCollection(COLLECTION_NAME);

const getSourcePosts = async (sourceId: string): Promise<BskyArticle[]> => {
	const db = await _collection;
	return (await db
		.find({ sourceId: sourceId })
		.sort({ publishedAt: -1 })
		.limit(MAX_SHOW_PER_CATEGORY)
		.toArray()) as unknown as BskyArticle[];
};

const getSourcePostsByKeyword = async (
	sourceId: string,
	keyword: string,
	previousDays: number
): Promise<BskyArticle[]> => {
	const db = await _collection;
	return (await db
		.find({
			$and: [
				{ sourceId: sourceId },
				{
					$or: [
						{ title: { $regex: keyword, $options: 'i' } },
						{ description: { $regex: keyword, $options: 'i' } },
					],
				},
				{
					$expr: {
						$gte: [
							{ $toDate: '$publishedAt' },
							{
								$dateSubtract: {
									startDate: '$$NOW',
									unit: 'day',
									amount: +previousDays || DEFAULT_PREVIOUS_DAYS,
								},
							},
						],
					},
				},
			],
		})
		.sort({ publishedAt: -1 })
		.limit(MAX_SHOW_PER_CATEGORY)
		.toArray()) as unknown as BskyArticle[];
};

const getSlantPosts = async (slant: SourceSlant): Promise<BskyArticle[]> => {
	const db = await _collection;
	return (await db
		.find({ slant: slant })
		.sort({ publishedAt: -1 })
		.limit(MAX_SLANT_RESULTS)
		.toArray()) as unknown as BskyArticle[];
};

const getSlantPostsByKeyword = async (
	slant: SourceSlant,
	keyword: string,
	previousDays: number
): Promise<BskyArticle[]> => {
	const db = await _collection;
	return (await db
		.find({
			$and: [
				{ slant: slant },
				{
					$or: [
						{ title: { $regex: keyword, $options: 'i' } },
						{ description: { $regex: keyword, $options: 'i' } },
					],
				},
				{
					$expr: {
						$gte: [
							{ $toDate: '$publishedAt' },
							{
								$dateSubtract: {
									startDate: '$$NOW',
									unit: 'day',
									amount: +previousDays || DEFAULT_PREVIOUS_DAYS,
								},
							},
						],
					},
				},
			],
		})
		.sort({ publishedAt: -1 })
		.limit(MAX_SLANT_RESULTS)
		.toArray()) as unknown as BskyArticle[];
};

const sortPostsFromMultiSources = (posts: BskyArticle[]): BskyArticle[] => {
	const sourcePostCounts: Record<string, number> = {};
	const postsByCount: BskyArticle[][] = [];

	for (let i = 0; i < posts.length; i++) {
		const post = posts[i];
		const { sourceId } = post;

		const index = sourcePostCounts[sourceId] || 0;
		if (!sourcePostCounts[sourceId]) {
			sourcePostCounts[sourceId] = 1;
		} else {
			sourcePostCounts[sourceId]++;
		}

		if (!postsByCount[index]) {
			postsByCount[index] = [];
		}
		postsByCount[index].push(post);
	}

	return postsByCount.flat().slice(0, MAX_SHOW_PER_CATEGORY);
};

export const getHeadlines = async (params: SearchRequest): Promise<ArticleMap> => {
	if (!params || (!params.sources && params.spectrumSearchAll !== 'Y')) {
		return {};
	}
	const isSpectrumSearch = !params.sources && params.spectrumSearchAll === 'Y';

	return isSpectrumSearch
		? Object.keys(SOURCE_SLANT_MAP).reduce<Promise<ArticleMap>>(
				async (memo: Promise<ArticleMap>, slantKey: string) => {
					const slant = +slantKey as SourceSlant;
					const posts = await (params.keyword
						? getSlantPostsByKeyword(slant, params.keyword, params.previousDays)
						: getSlantPosts(slant));
					const acc = await memo;
					acc[slant] = sortPostsFromMultiSources(posts);
					return acc;
				},
				Promise.resolve({})
			)
		: params.sources
				.split(',')
				.reduce<Promise<ArticleMap>>(async (memo: Promise<ArticleMap>, sourceId: string) => {
					const posts = await (params.keyword
						? getSourcePostsByKeyword(sourceId, params.keyword, params.previousDays)
						: getSourcePosts(sourceId));
					const acc = await memo;
					acc[sourceId] = posts;
					return acc;
				}, Promise.resolve({}));
};
