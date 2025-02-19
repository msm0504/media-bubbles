import { afterAll, afterEach, beforeAll, expect, test, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { getBskyProfile, getHeadlines } from '../bsky-news-service';
import { getBskyListUriForSlant } from '../bsky-list-service';
import { getSourceLists } from '../source-list-service';
import { SearchRequest } from '@/types';

vi.mock('../bsky-list-service');
vi.mock('../source-list-service');

const server = setupServer(
	http.get('/bsky/searchActorsTypeahead', () =>
		HttpResponse.json({ data: { actors: [{ did: 'did:example:123', handle: 'example' }] } })
	),
	http.get('/bsky/getAuthorFeed', () =>
		HttpResponse.json({
			data: {
				feed: [
					{
						post: {
							uri: 'uri',
							author: { did: 'did:example:123' },
							record: { text: 'example text' },
							embed: {
								$type: 'app.bsky.embed.external#view',
								external: {
									uri: 'http://example.com',
									title: 'Example',
									description: 'Example description',
								},
							},
						},
					},
					{
						post: {
							uri: 'uri2',
							author: { did: 'did:example:123' },
							record: { text: 'example text' },
							embed: {
								$type: 'app.bsky.embed.external#view',
								external: {
									uri: 'http://example.com/abc',
									title: '',
									description: '',
								},
							},
						},
					},
					{
						post: {
							uri: 'uri3',
							author: { did: 'did:example:123' },
							record: { text: 'example text http://example.com/efg' },
							embed: {
								$type: 'app.bsky.embed.external#other',
							},
						},
					},
				],
			},
		})
	),
	http.get('/bsky/searchPosts', () =>
		HttpResponse.json({
			data: {
				posts: [
					{
						uri: 'uri',
						author: { did: 'did:example:123' },
						record: { text: 'example text' },
						embed: {
							$type: 'app.bsky.embed.external#view',
							external: {
								uri: 'http://example.com',
								title: 'Example',
								description: 'Example description',
							},
						},
					},
				],
			},
		})
	),
	http.get('/bsky/getListFeed', () =>
		HttpResponse.json({
			data: {
				feed: [
					{
						post: {
							uri: 'uri',
							author: { did: 'did:example:123' },
							record: { text: 'example text' },
							embed: {
								$type: 'app.bsky.embed.external#view',
								external: {
									uri: 'http://example.com',
									title: 'Example',
									description: 'Example description',
								},
							},
						},
					},
				],
			},
		})
	)
);

beforeAll(() => {
	server.listen();
	vi.mocked(getSourceLists).mockResolvedValue({
		appSourceList: [
			{
				id: 'example',
				bskyDid: 'did:example:123',
				bskyHandle: 'example',
				name: 'example',
				url: 'example.com',
			},
		],
		sourceListBySlant: [
			[],
			[
				{
					id: 'example',
					bskyDid: 'did:example:123',
					bskyHandle: 'example',
					name: 'example',
					url: 'example.com',
				},
			],
			[],
			[],
			[],
		],
	});
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('getBskyProfile returns profile based on URL', async () => {
	const profile = await getBskyProfile('example', 'http://example.com');
	expect(profile).toEqual({ did: 'did:example:123', handle: 'example' });
});

test('getSourcePosts returns posts for a given handle', async () => {
	const params = {
		sources: 'example',
		spectrumSearchAll: 'N',
	};
	const headlines = await getHeadlines(params as SearchRequest);
	expect(headlines).toEqual({
		example: [
			{
				source: { id: 'example', name: 'example' },
				title: 'Example',
				description: 'Example description',
				url: 'http://example.com',
				publishedAt: '',
			},
			{
				id: 'uri2',
				sourceName: 'example',
				url: 'http://example.com/abc',
				text: 'example text',
			},
			{
				id: 'uri3',
				sourceName: 'example',
				url: 'http://example.com/efg',
				text: 'example text',
			},
		],
	});
});

test('getSourcePostsByKeyword returns posts for a given handle and keyword', async () => {
	const params = {
		sources: 'example',
		keyword: 'keyword',
		previousDays: 5,
		spectrumSearchAll: 'N',
	};
	const headlines = await getHeadlines(params as SearchRequest);
	expect(headlines).toEqual({
		example: [
			{
				source: { id: 'example', name: 'example' },
				title: 'Example',
				description: 'Example description',
				url: 'http://example.com',
				publishedAt: '',
			},
		],
	});
});

test('getListPosts returns posts for a given slant', async () => {
	vi.mocked(getBskyListUriForSlant).mockReturnValue('listUri');
	const params = { spectrumSearchAll: 'Y' };
	const headlines = await getHeadlines(params as SearchRequest);
	expect(headlines).toEqual({
		0: [],
		1: [
			{
				source: { id: 'example', name: 'example' },
				title: 'Example',
				description: 'Example description',
				url: 'http://example.com',
				publishedAt: '',
			},
		],
		2: [],
		3: [],
		4: [],
	});
});

test('getListPostsByKeyword returns posts for given sources and keyword', async () => {
	const params = {
		keyword: 'keyword',
		previousDays: 5,
		spectrumSearchAll: 'Y',
	};
	const headlines = await getHeadlines(params as SearchRequest);
	expect(headlines).toEqual({
		0: [],
		1: [
			{
				source: { id: 'example', name: 'example' },
				title: 'Example',
				description: 'Example description',
				url: 'http://example.com',
				publishedAt: '',
			},
		],
		2: [],
		3: [],
		4: [],
	});
});
