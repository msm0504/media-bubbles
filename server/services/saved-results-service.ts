import { nanoid } from 'nanoid';
import { getCollection } from './db-connection';
import {
	ItemDeletedResponse,
	ItemSavedResponse,
	ListResponse,
	SavedResult,
	SavedResultSummary
} from '../../types';

const COLLECTION_NAME = 'saved_results';
const PAGE_SIZE = 10;

const _collection = getCollection(COLLECTION_NAME);

export async function saveSearchResult(result: SavedResult): Promise<ItemSavedResponse> {
	const db = await _collection;
	const { insertedId } = await db.insertOne({
		_id: nanoid(16),
		...result,
		createdAt: new Date().toISOString()
	});
	return { itemId: insertedId };
}

export async function getSavedResults(
	filter = '',
	page = 1,
	userId: string
): Promise<ListResponse<SavedResultSummary>> {
	const db = await _collection;
	const count = await db
		.find({ name: { $regex: `^.*${filter}.*$`, $options: 'i' }, userId: userId })
		.count();
	const savedResults = await db
		.find({ name: { $regex: `^.*${filter}.*$`, $options: 'i' }, userId: userId })
		.sort({ createdAt: -1 })
		.skip(PAGE_SIZE * (page - 1))
		.limit(PAGE_SIZE)
		.map(({ _id, name, createdAt }) => ({ _id, name, createdAt }))
		.toArray();

	return {
		items: savedResults,
		pageCount: Math.ceil(count / PAGE_SIZE)
	};
}

export async function getAllSavedResults(
	filter = '',
	page = 1
): Promise<ListResponse<SavedResultSummary>> {
	const db = await _collection;
	const count = await db.find({ name: { $regex: `^.*${filter}.*$`, $options: 'i' } }).count();
	const savedResults = await db
		.find({ name: { $regex: `^.*${filter}.*$`, $options: 'i' } })
		.sort({ createdAt: -1 })
		.skip(PAGE_SIZE * (page - 1))
		.limit(PAGE_SIZE)
		.map(({ _id, name, createdAt }) => ({ _id, name, createdAt }))
		.toArray();

	return {
		items: savedResults,
		pageCount: Math.ceil(count / PAGE_SIZE)
	};
}

export async function getSavedResult(id: string): Promise<SavedResult> {
	const db = await _collection;
	return db.findOne({ _id: id });
}

export async function deleteSavedResult(id: string, userId?: string): Promise<ItemDeletedResponse> {
	const db = await _collection;
	const { deletedCount } = await db.deleteOne({ _id: id, userId: userId });
	return { itemDeleted: deletedCount === 1 };
}
