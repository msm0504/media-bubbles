import { afterEach, describe, expect, test, vi } from 'vitest';
import { app } from '@bsky/sdk/lexicons';
import type { Source } from '@/types';

const mocks = vi.hoisted(() => {
	const db = {
		insertMany: vi.fn(),
		updateMany: vi.fn(),
		deleteMany: vi.fn(),
	};
	return {
		db,
		getCollection: vi.fn().mockResolvedValue(db),
		getBskyPublicAgent: vi.fn(),
		getBskyNewsListUri: vi.fn(),
		getSourceLists: vi.fn(),
	};
});

vi.mock('@/connections/db-connection', () => ({ getCollection: mocks.getCollection }));
vi.mock('@/connections/bsky-agent', () => ({ getBskyPublicAgent: mocks.getBskyPublicAgent }));
vi.mock('../bsky-list-service', () => ({ getBskyNewsListUri: mocks.getBskyNewsListUri }));
vi.mock('../source-list-service', () => ({ getSourceLists: mocks.getSourceLists }));

import {
	deleteSourcePosts,
	loadPostsForNewSource,
	loadRecentPostsForAllSources,
	updateSlantForSourcePosts,
} from '../bsky-post-service';

const source: Source = {
	id: 'example',
	name: 'Example News',
	url: 'example.com',
	slant: 2,
	bskyHandle: 'example.bsky.social',
	bskyDid: 'did:plc:example',
};

const makePost = (overrides: Record<string, unknown> = {}) =>
	({
		uri: 'at://did:plc:example/app.bsky.feed.post/post-1',
		indexedAt: '2026-01-01T12:00:00.000Z',
		author: { did: 'did:plc:example' },
		record: { text: 'Read this https://example.com/story' },
		...overrides,
	}) as never;

afterEach(() => vi.clearAllMocks());

describe('bsky post service', () => {
	test('loads and stores formatted source posts', async () => {
		const agent = { call: vi.fn().mockResolvedValue({ feed: [{ post: makePost() }] }) };
		mocks.getBskyPublicAgent.mockReturnValue(agent);
		mocks.getSourceLists.mockResolvedValue({ appSourceList: [source] });

		await loadPostsForNewSource(source);

		expect(agent.call).toHaveBeenCalledWith(
			app.bsky.feed.getAuthorFeed,
			expect.objectContaining({ actor: source.bskyHandle, limit: 50, includePins: false })
		);
		expect(mocks.db.insertMany).toHaveBeenCalledWith([
			expect.objectContaining({
				_id: 'post-1',
				sourceId: source.id,
				description: 'Read this',
				url: 'https://example.com/story',
			}),
		]);
	});

	test('handles rejected author-feed requests by storing no posts', async () => {
		const agent = { call: vi.fn().mockRejectedValue(new Error('unavailable')) };
		mocks.getBskyPublicAgent.mockReturnValue(agent);
		mocks.getSourceLists.mockResolvedValue({ appSourceList: [source] });
		vi.spyOn(console, 'error').mockImplementation(() => undefined);

		await loadPostsForNewSource(source);

		expect(mocks.db.insertMany).toHaveBeenCalledWith([]);
	});

	test('skips list-feed posts that are not mapped to a configured source', async () => {
		const agent = {
			call: vi.fn().mockResolvedValue({
				feed: [{ post: makePost({ author: { did: 'did:plc:unknown' } }) }],
			}),
		};
		mocks.getBskyPublicAgent.mockReturnValue(agent);
		mocks.getBskyNewsListUri.mockResolvedValue('at://did:plc:owner/app.bsky.graph.list/news');
		mocks.getSourceLists.mockResolvedValue({ appSourceList: [source] });

		await loadRecentPostsForAllSources();

		expect(mocks.db.insertMany).toHaveBeenCalledWith([]);
	});

	test('filters posts with duplicate IDs, similar titles, or similar descriptions', async () => {
		const externalPost = (id: string, title: string, description: string) =>
			makePost({
				uri: `at://did:plc:example/app.bsky.feed.post/${id}`,
				embed: {
					$type: 'app.bsky.embed.external#view',
					external: { title, description, uri: `https://example.com/${id}` },
				},
			});
		const agent = {
			call: vi.fn().mockResolvedValue({
				feed: [
					{
						post: externalPost('first', 'Breaking major update', 'Full details from Example News'),
					},
					{ post: externalPost('same-title', 'Breaking major update', 'A different summary') },
					{
						post: externalPost(
							'same-description',
							'A different story',
							'Full details from Example News'
						),
					},
					{ post: externalPost('first', 'A completely new title', 'A completely new summary') },
					{ post: externalPost('unique', 'Independent report', 'Original reporting and analysis') },
				],
			}),
		};
		mocks.getBskyPublicAgent.mockReturnValue(agent);
		mocks.getSourceLists.mockResolvedValue({ appSourceList: [source] });

		await loadPostsForNewSource(source);

		expect(mocks.db.insertMany).toHaveBeenCalledWith([
			expect.objectContaining({ _id: 'first' }),
			expect.objectContaining({ _id: 'unique' }),
		]);
	});

	test('updates and deletes all persisted posts for a source', async () => {
		await updateSlantForSourcePosts(source);
		await deleteSourcePosts(source.id);

		expect(mocks.db.updateMany).toHaveBeenCalledWith(
			{ sourceId: source.id },
			{ $set: { slant: source.slant } }
		);
		expect(mocks.db.deleteMany).toHaveBeenCalledWith({ sourceId: source.id });
	});
});
