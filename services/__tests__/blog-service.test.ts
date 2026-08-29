import { afterEach, describe, expect, test, vi } from 'vitest';
import type { BlogPost } from '@/types';

const mocks = vi.hoisted(() => {
	const db = {
		insertOne: vi.fn(),
		updateOne: vi.fn(),
		find: vi.fn(),
		findOne: vi.fn(),
		countDocuments: vi.fn(),
		deleteOne: vi.fn(),
	};
	return {
		db,
		getCollection: vi.fn().mockResolvedValue(db),
		cacheTag: vi.fn(),
		revalidateTag: vi.fn(),
	};
});

vi.mock('@/connections/db-connection', () => ({ getCollection: mocks.getCollection }));
vi.mock('next/cache', () => ({ cacheTag: mocks.cacheTag, revalidateTag: mocks.revalidateTag }));

import {
	createPost,
	deletePost,
	getAllPostSlugs,
	getLatestPostSlug,
	getPost,
	getPostSummaries,
	updatePost,
} from '../blog-service';

const post: BlogPost = {
	author: 'A',
	title: 'Title',
	slug: 'My-Post',
	content: 'First sentence. Second sentence.',
};
const chain = (items: unknown[]) => ({
	sort: vi.fn().mockReturnThis(),
	skip: vi.fn().mockReturnThis(),
	limit: vi.fn().mockReturnThis(),
	map: vi.fn((callback: (item: never) => unknown) => ({
		toArray: vi.fn().mockResolvedValue(items.map(item => callback(item as never))),
	})),
	toArray: vi.fn().mockResolvedValue(items),
});

afterEach(() => {
	vi.clearAllMocks();
	vi.useRealTimers();
});

describe('blog service', () => {
	test('creates a dated, lower-case slug and excerpt', async () => {
		vi.setSystemTime(new Date('2026-08-26T12:00:00.000Z'));
		mocks.db.insertOne.mockResolvedValue({ insertedId: { toString: () => 'new-id' } });

		await expect(createPost(post)).resolves.toEqual({ itemId: 'new-id' });
		expect(mocks.db.insertOne).toHaveBeenCalledWith(
			expect.objectContaining({
				_id: '2026-08-26-my-post',
				slug: '2026-08-26-my-post',
				excerpt: 'First sentence...',
			})
		);
		expect(mocks.revalidateTag).toHaveBeenCalledWith('blog-posts', 'max');
	});

	test('updates and deletes posts while invalidating relevant tags', async () => {
		mocks.db.updateOne.mockResolvedValue({ modifiedCount: 1 });
		mocks.db.deleteOne.mockResolvedValue({ deletedCount: 1 });

		await expect(updatePost({ ...post, slug: 'post' })).resolves.toEqual({ itemId: 'post' });
		await expect(deletePost('post')).resolves.toEqual({ itemDeleted: true });
		expect(mocks.db.updateOne).toHaveBeenCalledWith(
			{ _id: 'post' },
			expect.objectContaining({ $set: expect.objectContaining({ excerpt: 'First sentence...' }) })
		);
		expect(mocks.revalidateTag).toHaveBeenCalledWith('blog-posts-post', 'max');
	});

	test('reads slugs, latest post, post details, and paginated summaries', async () => {
		mocks.db.find
			.mockReturnValueOnce(chain([{ slug: 'a', updatedAt: 'date' }]))
			.mockReturnValueOnce(chain([{ slug: 'a' }]))
			.mockReturnValueOnce(chain([{ title: 'Title' }]));
		mocks.db.countDocuments.mockResolvedValue(11);

		await expect(getAllPostSlugs()).resolves.toEqual([{ slug: 'a', updatedAt: 'date' }]);
		await expect(getLatestPostSlug()).resolves.toBe('a');
		mocks.db.findOne.mockResolvedValue(post);
		await expect(getPost('post')).resolves.toEqual(post);
		await expect(getPostSummaries('title', 2)).resolves.toEqual({
			items: [{ title: 'Title' }],
			pageCount: 2,
		});
		expect(mocks.cacheTag).toHaveBeenCalledWith('blog-posts-post');
	});
});
