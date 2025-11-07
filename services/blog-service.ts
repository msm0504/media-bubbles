import { ObjectId } from 'mongodb';
import { getCollection } from './db-connection';
import {
	BlogPost,
	BlogPostSummary,
	ItemDeletedResponse,
	ItemSavedResponse,
	ListResponse,
} from '@/types';

const COLLECTION_NAME = 'blog_posts';
const PAGE_SIZE = 10;

const _collection = getCollection(COLLECTION_NAME);

const formatExcerpt = (content: string) => {
	const MAX_LENGTH = 350;
	const lastSentenceEnd = content.substring(0, MAX_LENGTH).search(/[,.?!:]\s(?!.*[,.?!:]\s)/);
	return `${content.substring(0, lastSentenceEnd)}...`;
};

const SLUG_WITH_TS_PATTERN = /^\d{4}-\d{2}-\d{2}-/;

export const savePost = async (post: BlogPost): Promise<ItemSavedResponse> => {
	return SLUG_WITH_TS_PATTERN.test(post.slug) ? updatePost(post) : createPost(post);
};

const createPost = async (post: BlogPost) => {
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
	return { itemId: insertedId.toString() };
};

const updatePost = async (post: BlogPost) => {
	const db = await _collection;
	const updateTs = new Date().toISOString();
	const { modifiedCount } = await db.updateOne(
		{ _id: post.slug as unknown as ObjectId },
		{ $set: { ...post, excerpt: formatExcerpt(post.content), updatedAt: updateTs } }
	);
	return { itemId: modifiedCount === 1 ? post.slug : '' };
};

export const getAllPostSlugs = async (): Promise<string[]> => {
	const db = await _collection;
	return db
		.find()
		.sort({ updatedAt: -1 })
		.map(({ slug }) => slug)
		.toArray();
};

export const getLatestPostSlug = async (): Promise<string> => {
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
	const db = await _collection;
	return db.findOne({ _id: slug as unknown as ObjectId }) as unknown as BlogPost;
};

export const getPostSummaries = async (
	filter = '',
	page = 1
): Promise<ListResponse<BlogPostSummary>> => {
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
	return { itemDeleted: deletedCount === 1 };
};
