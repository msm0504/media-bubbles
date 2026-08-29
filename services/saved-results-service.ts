import { cacheTag, revalidateTag } from 'next/cache';
import { nanoid } from 'nanoid';
import {
	ItemDeletedResponse,
	ItemSavedResponse,
	ListResponse,
	SavedResult,
	SavedResultSummary,
} from '@/types';
import { getCollection } from '@/connections/db-connection';

const COLLECTION_NAME = 'saved_results';
const CACHE_TAG = 'saved-results';
const PAGE_SIZE = 10;

const _collection = getCollection<SavedResult>(COLLECTION_NAME);

export const saveSearchResult = async (result: SavedResult): Promise<ItemSavedResponse> => {
	const db = await _collection;
	const { insertedId } = await db.insertOne({
		...result,
		_id: nanoid(16),
		createdAt: new Date().toISOString(),
	});
	revalidateTag(CACHE_TAG, 'max');
	return { itemId: insertedId.toString() };
};

export const setSavedResultImagePath = async (id: string, url: string): Promise<void> => {
	const db = await _collection;
	await db.updateOne({ _id: id }, { $set: { imagePath: url } });
	revalidateTag(`${CACHE_TAG}-${id}`, 'max');
};

export const getSavedResults = async (
	filter = '',
	page = 1,
	userId: string
): Promise<ListResponse<SavedResultSummary>> => {
	'use cache';
	cacheTag(CACHE_TAG);
	const db = await _collection;
	const count = await db.countDocuments({
		name: { $regex: filter, $options: 'i' },
		userId: userId,
	});
	const savedResults = (await db
		.find({ name: { $regex: filter, $options: 'i' }, userId: userId })
		.sort({ createdAt: -1 })
		.skip(PAGE_SIZE * (page - 1))
		.limit(PAGE_SIZE)
		.map(({ _id, name, createdAt }) => ({ _id, name, createdAt }))
		.toArray()) as unknown as SavedResultSummary[];

	return {
		items: savedResults,
		pageCount: Math.ceil(count / PAGE_SIZE),
	};
};

export const getAllSavedResults = async (
	filter = '',
	page = 1,
	pageSize = PAGE_SIZE
): Promise<ListResponse<SavedResultSummary>> => {
	'use cache';
	cacheTag(CACHE_TAG);
	const db = await _collection;
	const count = await db.countDocuments({ name: { $regex: filter, $options: 'i' } });
	const savedResults = (await db
		.find({ name: { $regex: filter, $options: 'i' } })
		.sort({ createdAt: -1 })
		.skip(pageSize * (page - 1))
		.limit(pageSize)
		.map(({ _id, name, createdAt }) => ({ _id, name, createdAt }))
		.toArray()) as unknown as SavedResultSummary[];

	return {
		items: savedResults,
		pageCount: Math.ceil(count / pageSize),
	};
};

export const getSavedResult = async (id: string): Promise<SavedResult | null> => {
	'use cache';
	cacheTag(`${CACHE_TAG}-${id}`);
	const db = await _collection;
	return db.findOne({ _id: id }) as unknown as SavedResult;
};

export const deleteSavedResult = async (
	id: string,
	userId?: string
): Promise<ItemDeletedResponse> => {
	const db = await _collection;
	const { deletedCount } = await db.deleteOne({ _id: id, userId: userId });
	revalidateTag(CACHE_TAG, 'max');
	revalidateTag(`${CACHE_TAG}-${id}`, 'max');
	return { itemDeleted: deletedCount === 1 };
};
