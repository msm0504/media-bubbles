import { ObjectId } from 'mongodb';
import { nanoid } from 'nanoid';
import { getCollection } from './db-connection';
import {
	ItemDeletedResponse,
	ItemSavedResponse,
	ListResponse,
	SavedResult,
	SavedResultSummary,
} from '@/types';

const COLLECTION_NAME = 'saved_results';
const PAGE_SIZE = 10;

const _collection = getCollection(COLLECTION_NAME);

export const saveSearchResult = async (result: SavedResult): Promise<ItemSavedResponse> => {
	const db = await _collection;
	const { insertedId } = await db.insertOne({
		...result,
		_id: nanoid(16) as unknown as ObjectId,
		createdAt: new Date().toISOString(),
	});
	return { itemId: insertedId.toString() };
};

export const getSavedResults = async (
	filter = '',
	page = 1,
	userId: string
): Promise<ListResponse<SavedResultSummary>> => {
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
	const db = await _collection;
	return db.findOne({ _id: id as unknown as ObjectId }) as unknown as SavedResult;
};

export const deleteSavedResult = async (
	id: string,
	userId?: string
): Promise<ItemDeletedResponse> => {
	const db = await _collection;
	const { deletedCount } = await db.deleteOne({ _id: id as unknown as ObjectId, userId: userId });
	return { itemDeleted: deletedCount === 1 };
};
