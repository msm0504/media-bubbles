import { cacheTag, revalidateTag } from 'next/cache';
import { ObjectId } from 'mongodb';
import { getCollection } from './db-connection';
import type {
	BlogPost,
	BlogPostSummary,
	ItemDeletedResponse,
	ItemSavedResponse,
	ListResponse,
} from '@/types';

const COLLECTION_NAME = 'blog_posts';
const CACHE_TAG = 'blog-posts';
const PAGE_SIZE = 10;

const _collection = getCollection(COLLECTION_NAME);

const formatExcerpt = (content: string) => {
	const MAX_LENGTH = 350;
	const lastSentenceEnd = content.substring(0, MAX_LENGTH).search(/[,.?!:]\s(?!.*[,.?!:]\s)/);
	return `${content.substring(0, lastSentenceEnd)}...`;
};

export const createPost = async (post: BlogPost): Promise<ItemSavedResponse> => {
	const db = await _collection;
	const createTs = new Date().toISOString();
	const slugWithTs = `${createTs.split('T')[0]}-${post.slug.toLowerCase()}`;
	const { insertedId } = await db.insertOne({
		...post,
		_id: slugWithTs as unknown as ObjectId,
		slug: slugWithTs,
		excerpt: formatExcerpt(post.content),
		createdAt: createTs,
		updatedAt: createTs,
	});
	revalidateTag(CACHE_TAG, 'max');
	return { itemId: insertedId.toString() };
};

export const updatePost = async (post: BlogPost): Promise<ItemSavedResponse> => {
	const db = await _collection;
	const updateTs = new Date().toISOString();
	const { modifiedCount } = await db.updateOne(
		{ _id: post.slug as unknown as ObjectId },
		{ $set: { ...post, excerpt: formatExcerpt(post.content), updatedAt: updateTs } }
	);
	revalidateTag(CACHE_TAG, 'max');
	revalidateTag(`${CACHE_TAG}-${post.slug}`, 'max');
	return { itemId: modifiedCount === 1 ? post.slug : '' };
};

export const getAllPostSlugs = async (): Promise<{ slug: string; updatedAt: string }[]> => {
	'use cache';
	cacheTag(CACHE_TAG);
	const db = await _collection;
	return db
		.find()
		.sort({ updatedAt: -1 })
		.map(({ slug, updatedAt }) => ({ slug, updatedAt }))
		.toArray();
};

export const getLatestPostSlug = async (): Promise<string> => {
	'use cache';
	cacheTag(CACHE_TAG);
	const db = await _collection;
	return db
		.find()
		.sort({ updatedAt: -1 })
		.limit(1)
		.map(({ slug }) => slug)
		.toArray()
		.then(([latest]) => latest);
};

export const getPost = async (slug: string): Promise<BlogPost> => {
	'use cache';
	cacheTag(`${CACHE_TAG}-${slug}`);
	const db = await _collection;
	return db.findOne({ _id: slug as unknown as ObjectId }) as unknown as BlogPost;
};

export const getPostSummaries = async (
	filter = '',
	page = 1
): Promise<ListResponse<BlogPostSummary>> => {
	'use cache';
	cacheTag(CACHE_TAG);
	const db = await _collection;
	const count = await db.countDocuments({
		$or: [
			{ slug: { $regex: filter, $options: 'i' } },
			{ title: { $regex: filter, $options: 'i' } },
		],
	});

	const postSummaries = (await db
		.find({
			$or: [
				{ slug: { $regex: filter, $options: 'i' } },
				{ title: { $regex: filter, $options: 'i' } },
			],
		})
		.sort({ updatedAt: -1 })
		.skip(PAGE_SIZE * (page - 1))
		.limit(PAGE_SIZE)
		.map(({ content, ...metaData }) => metaData)
		.toArray()) as unknown as BlogPostSummary[];

	return {
		items: postSummaries,
		pageCount: Math.ceil(count / PAGE_SIZE),
	};
};

export const deletePost = async (slug: string): Promise<ItemDeletedResponse> => {
	const db = await _collection;
	const { deletedCount } = await db.deleteOne({ _id: slug as unknown as ObjectId });
	revalidateTag(CACHE_TAG, 'max');
	revalidateTag(`${CACHE_TAG}-${slug}`, 'max');
	return { itemDeleted: deletedCount === 1 };
};
