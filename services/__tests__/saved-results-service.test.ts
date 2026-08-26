import { afterEach, describe, expect, test, vi } from 'vitest';
import type { SavedResult } from '@/types';

const mocks = vi.hoisted(() => {
	const db = {
		insertOne: vi.fn(),
		updateOne: vi.fn(),
		find: vi.fn(),
		countDocuments: vi.fn(),
		findOne: vi.fn(),
		deleteOne: vi.fn(),
	};
	return {
		db,
		getCollection: vi.fn().mockResolvedValue(db),
		nanoid: vi.fn().mockReturnValue('generated-id'),
		cacheTag: vi.fn(),
		revalidateTag: vi.fn(),
	};
});
vi.mock('@/connections/db-connection', () => ({ getCollection: mocks.getCollection }));
vi.mock('nanoid', () => ({ nanoid: mocks.nanoid }));
vi.mock('next/cache', () => ({ cacheTag: mocks.cacheTag, revalidateTag: mocks.revalidateTag }));

import {
	deleteSavedResult,
	getAllSavedResults,
	getSavedResult,
	getSavedResults,
	saveSearchResult,
	setSavedResultImagePath,
} from '../saved-results-service';

const result = {
	name: 'Search',
	articleMap: {},
	isSearchAll: false,
	sourceList: [],
	userId: 'user-1',
} as SavedResult;
const chain = (items: unknown[]) => ({
	sort: vi.fn().mockReturnThis(),
	skip: vi.fn().mockReturnThis(),
	limit: vi.fn().mockReturnThis(),
	map: vi.fn().mockReturnThis(),
	toArray: vi.fn().mockResolvedValue(items),
});
afterEach(() => vi.clearAllMocks());

describe('saved results service', () => {
	test('saves a result and updates its image path', async () => {
		mocks.db.insertOne.mockResolvedValue({ insertedId: { toString: () => 'generated-id' } });
		await expect(saveSearchResult(result)).resolves.toEqual({ itemId: 'generated-id' });
		await setSavedResultImagePath('generated-id', 'https://img.test/result.png');
		expect(mocks.db.insertOne).toHaveBeenCalledWith(
			expect.objectContaining({ _id: 'generated-id', userId: 'user-1' })
		);
		expect(mocks.db.updateOne).toHaveBeenCalledWith(
			{ _id: 'generated-id' },
			{ $set: { imagePath: 'https://img.test/result.png' } }
		);
	});

	test('queries user-scoped and all-result summaries with pagination', async () => {
		mocks.db.countDocuments.mockResolvedValueOnce(11).mockResolvedValueOnce(3);
		mocks.db.find
			.mockReturnValueOnce(chain([{ _id: '1', name: 'Search', createdAt: 'date' }]))
			.mockReturnValueOnce(chain([]));
		await expect(getSavedResults('sea', 2, 'user-1')).resolves.toEqual({
			items: [{ _id: '1', name: 'Search', createdAt: 'date' }],
			pageCount: 2,
		});
		await expect(getAllSavedResults('', 1, 5)).resolves.toEqual({ items: [], pageCount: 1 });
		expect(mocks.db.find).toHaveBeenCalledWith({
			name: { $regex: 'sea', $options: 'i' },
			userId: 'user-1',
		});
	});

	test('gets and deletes a saved result', async () => {
		mocks.db.findOne.mockResolvedValue(result);
		mocks.db.deleteOne.mockResolvedValue({ deletedCount: 1 });
		await expect(getSavedResult('id')).resolves.toEqual(result);
		await expect(deleteSavedResult('id', 'user-1')).resolves.toEqual({ itemDeleted: true });
		expect(mocks.db.deleteOne).toHaveBeenCalledWith({ _id: 'id', userId: 'user-1' });
	});
});
