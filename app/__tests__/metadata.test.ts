import { expect, test, vi } from 'vitest';
import manifest from '../manifest';
import robots from '../robots';
import sitemap from '../sitemap';

test('manifest json', () => {
	const result = manifest();
	expect(result.name).toEqual('Media Bubbles');
});

test('robots txt', () => {
	const result = robots();
	expect(result.host).toEqual('http://test.com');
});

test('sitemap xml', async () => {
	vi.mock('@/services/saved-results-service', () => ({
		getAllSavedResults: vi.fn().mockResolvedValue({
			items: [
				{ _id: 'id1', name: 'name1', createdAt: 'timestamp1' },
				{ _id: 'id2', name: 'name2', createdAt: 'timestamp2' },
				{ _id: 'id3', name: 'name3', createdAt: 'timestamp3' },
			],
			pageCount: 1,
		}),
	}));
	vi.mock('@/services/blog-service', () => ({
		getAllPostSlugs: vi.fn().mockResolvedValue([]),
	}));
	const result = await sitemap();
	expect(result[result.length - 2]).toEqual({
		url: 'http://test.com/headlines/id2',
		lastModified: 'timestamp2',
	});
});
