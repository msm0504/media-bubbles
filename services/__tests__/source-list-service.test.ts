import { afterEach, describe, expect, test, vi } from 'vitest';
import type { Source } from '@/types';

const mocks = vi.hoisted(() => {
	const db = { findOne: vi.fn(), deleteMany: vi.fn(), insertOne: vi.fn() };
	return {
		db,
		getCollection: vi.fn().mockResolvedValue(db),
		synchBskyList: vi.fn(),
		loadPostsForNewSource: vi.fn(),
		updateSlantForSourcePosts: vi.fn(),
		deleteSourcePosts: vi.fn(),
		getBskyProfile: vi.fn(),
		cacheTag: vi.fn(),
		revalidateTag: vi.fn(),
	};
});

vi.mock('@/connections/db-connection', () => ({ getCollection: mocks.getCollection }));
vi.mock('../bsky-list-service', () => ({ synchBskyList: mocks.synchBskyList }));
vi.mock('../bsky-post-service', () => ({
	loadPostsForNewSource: mocks.loadPostsForNewSource,
	updateSlantForSourcePosts: mocks.updateSlantForSourcePosts,
	deleteSourcePosts: mocks.deleteSourcePosts,
}));
vi.mock('../bsky-profile-service', () => ({ getBskyProfile: mocks.getBskyProfile }));
vi.mock('next/cache', () => ({ cacheTag: mocks.cacheTag, revalidateTag: mocks.revalidateTag }));
vi.mock('../../data/source-include-list.json', () => ({ default: { 'Example News': true } }));
vi.mock('../../data/allsides_pub_data.json', () => ({
	default: {
		allsides_media_bias_ratings: {
			publication: [
				{
					source_name: 'Example News',
					media_bias_rating: 'Lean Left',
					source_url: 'https://www.example.com/news',
				},
			],
		},
	},
}));

import { getSourceLists, populateSourceLists, reloadSource } from '../source-list-service';

const listedSource: Source = {
	id: 'example-news',
	name: 'Example News',
	url: 'example.com',
	slant: 1,
};

const makeDb = (saved: unknown) => ({
	findOne: vi.fn().mockResolvedValue(saved),
	deleteMany: vi.fn(),
	insertOne: vi.fn(),
});

afterEach(() => vi.clearAllMocks());

describe('source list service', () => {
	test('builds, enriches, saves, and synchronizes a changed source list', async () => {
		const db = Object.assign(mocks.db, makeDb(null));
		mocks.getBskyProfile.mockResolvedValue({
			handle: 'example.bsky.social',
			did: 'did:plc:example',
		});

		await populateSourceLists();

		expect(mocks.getBskyProfile).toHaveBeenCalledWith('Example News', 'example.com');
		expect(mocks.loadPostsForNewSource).toHaveBeenCalledWith({
			...listedSource,
			bskyHandle: 'example.bsky.social',
			bskyDid: 'did:plc:example',
		});
		expect(db.deleteMany).toHaveBeenCalledWith({});
		expect(db.insertOne).toHaveBeenCalledWith(
			expect.objectContaining({ appSourceList: [expect.objectContaining(listedSource)] })
		);
		expect(mocks.revalidateTag).toHaveBeenCalledWith('source-lists', 'max');
		expect(mocks.synchBskyList).toHaveBeenCalledWith([expect.objectContaining(listedSource)]);
	});

	test('updates changed source posts and deletes removed source posts', async () => {
		const obsolete: Source = { id: 'obsolete', name: 'Obsolete', url: 'obsolete.com', slant: 4 };
		Object.assign(
			mocks.db,
			makeDb({
				appSourceList: [{ ...listedSource, slant: 3 }, obsolete],
				sourceListBySlant: [],
			})
		);
		mocks.getBskyProfile.mockResolvedValue(undefined);
		vi.spyOn(console, 'error').mockImplementation(() => undefined);

		await populateSourceLists();

		expect(mocks.updateSlantForSourcePosts.mock.calls[0][0]).toEqual(listedSource);
		expect(mocks.deleteSourcePosts.mock.calls[0][0]).toBe('obsolete');
	});

	test('returns the persisted source lists and attaches their cache tag', async () => {
		Object.assign(
			mocks.db,
			makeDb({ appSourceList: [listedSource], sourceListBySlant: [[listedSource]] })
		);

		await expect(getSourceLists()).resolves.toEqual({
			appSourceList: [listedSource],
			sourceListBySlant: [[listedSource]],
		});
		expect(mocks.cacheTag).toHaveBeenCalledWith('source-lists');
	});

	test('does nothing when reloading an unknown source', async () => {
		Object.assign(mocks.db, makeDb({ appSourceList: [listedSource], sourceListBySlant: [] }));
		const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);

		await reloadSource('unknown-source');

		expect(error).toHaveBeenCalledWith('unknown-source does not match any known sources');
		expect(mocks.getBskyProfile).not.toHaveBeenCalled();
		expect(mocks.deleteSourcePosts).not.toHaveBeenCalled();
		expect(mocks.loadPostsForNewSource).not.toHaveBeenCalled();
		expect(mocks.synchBskyList).not.toHaveBeenCalled();
	});

	test('updates changed profile data, reloads posts, and synchronizes the source list', async () => {
		const savedSource = { ...listedSource, bskyHandle: 'old.example', bskyDid: 'did:plc:old' };
		const sourceLists = { appSourceList: [savedSource], sourceListBySlant: [[], [savedSource]] };
		const db = Object.assign(mocks.db, makeDb(sourceLists));
		mocks.getBskyProfile.mockResolvedValue({
			handle: 'new.example',
			did: 'did:plc:new',
		});

		await reloadSource(listedSource.id);

		const reloadedSource = { ...savedSource, bskyHandle: 'new.example', bskyDid: 'did:plc:new' };
		expect(db.deleteMany).toHaveBeenCalledWith({});
		expect(db.insertOne).toHaveBeenCalledWith({
			appSourceList: [reloadedSource],
			sourceListBySlant: [[], [reloadedSource]],
		});
		expect(mocks.revalidateTag).toHaveBeenCalledWith('source-lists', 'max');
		expect(mocks.deleteSourcePosts).toHaveBeenCalledWith(listedSource.id);
		expect(mocks.loadPostsForNewSource).toHaveBeenCalledWith(reloadedSource);
		expect(mocks.synchBskyList).toHaveBeenCalledWith([reloadedSource]);
	});

	test('reloads posts without saving when the profile data is unchanged', async () => {
		const savedSource = {
			...listedSource,
			bskyHandle: 'example.bsky.social',
			bskyDid: 'did:plc:example',
		};
		Object.assign(
			mocks.db,
			makeDb({ appSourceList: [savedSource], sourceListBySlant: [[], [savedSource]] })
		);
		mocks.getBskyProfile.mockResolvedValue({
			handle: savedSource.bskyHandle,
			did: 'did:plc:updated-but-not-used',
		});

		await reloadSource(savedSource.id);

		expect(mocks.db.deleteMany).not.toHaveBeenCalled();
		expect(mocks.db.insertOne).not.toHaveBeenCalled();
		expect(mocks.revalidateTag).not.toHaveBeenCalled();
		expect(mocks.deleteSourcePosts).toHaveBeenCalledWith(savedSource.id);
		expect(mocks.loadPostsForNewSource).toHaveBeenCalledWith(savedSource);
		expect(mocks.synchBskyList).toHaveBeenCalledWith([savedSource]);
	});
});
