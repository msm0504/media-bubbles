import { afterEach, describe, expect, test, vi } from 'vitest';
import type { BskyArticle } from '@/types';

const mocks = vi.hoisted(() => {
	const db = { find: vi.fn() };
	return { db, getCollection: vi.fn().mockResolvedValue(db) };
});

vi.mock('@/connections/db-connection', () => ({ getCollection: mocks.getCollection }));

import { getHeadlines } from '../news-search-service';

const makeArticle = (id: string, sourceId: string): BskyArticle => ({
	_id: id,
	sourceId,
	sourceName: sourceId,
	slant: 2,
	description: id,
	url: `https://example.com/${id}`,
	publishedAt: new Date('2026-01-01'),
});

const makeDb = (results: BskyArticle[][]) => {
	let call = 0;
	const toArray = vi.fn(() => Promise.resolve(results[call++] || []));
	const limit = vi.fn(() => ({ toArray }));
	const sort = vi.fn(() => ({ limit }));
	const find = vi.fn(() => ({ sort }));
	return { db: { find }, find, sort, limit, toArray };
};

afterEach(() => vi.clearAllMocks());

describe('getHeadlines', () => {
	test('returns no results when neither sources nor spectrum search is selected', async () => {
		await expect(
			getHeadlines({ sources: '', spectrumSearchAll: 'N', keyword: '', previousDays: 5 })
		).resolves.toEqual({});
	});

	test('loads the newest posts for each requested source', async () => {
		const { find, sort, limit } = Object.assign(
			mocks.db,
			makeDb([[makeArticle('first', 'one')], [makeArticle('second', 'two')]])
		);

		await expect(
			getHeadlines({ sources: 'one,two', spectrumSearchAll: 'N', keyword: '', previousDays: 5 })
		).resolves.toEqual({ one: [makeArticle('first', 'one')], two: [makeArticle('second', 'two')] });
		expect(find).toHaveBeenNthCalledWith(1, { sourceId: 'one' });
		expect(find).toHaveBeenNthCalledWith(2, { sourceId: 'two' });
		expect(sort).toHaveBeenCalledWith({ publishedAt: -1 });
		expect(limit).toHaveBeenCalledWith(10);
	});

	test('uses case-insensitive whole-word keyword and date filters', async () => {
		const { find } = Object.assign(mocks.db, makeDb([[]]));

		await getHeadlines({
			sources: 'one',
			spectrumSearchAll: 'N',
			keyword: 'climate',
			previousDays: 3,
		});

		expect(find).toHaveBeenCalledWith({
			$and: [
				{ sourceId: 'one' },
				{
					$or: [
						{ title: { $regex: '\\bclimate\\b', $options: 'i' } },
						{ description: { $regex: '\\bclimate\\b', $options: 'i' } },
					],
				},
				expect.objectContaining({ $expr: expect.any(Object) }),
			],
		});
	});

	test('groups spectrum results by slant and interleaves sources within each group', async () => {
		Object.assign(
			mocks.db,
			makeDb([
				[
					makeArticle('left-1', 'left-a'),
					makeArticle('left-2', 'left-a'),
					makeArticle('left-b', 'left-b'),
				],
				[],
				[],
				[],
				[],
			])
		);

		const result = await getHeadlines({
			sources: '',
			spectrumSearchAll: 'Y',
			keyword: '',
			previousDays: 5,
		});

		expect(result['0'].map(article => (article as BskyArticle)._id)).toEqual([
			'left-1',
			'left-b',
			'left-2',
		]);
		expect(result).toMatchObject({ 1: [], 2: [], 3: [], 4: [] });
	});
});
