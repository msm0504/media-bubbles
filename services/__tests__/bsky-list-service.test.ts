import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { app } from '@bsky/sdk/lexicons';
import type { Source } from '@/types';

const mocks = vi.hoisted(() => ({
	getBskyAgent: vi.fn(),
	atUri: vi.fn(function () {
		return { rkey: 'obsolete-rkey' };
	}),
}));

vi.mock('@/connections/bsky-agent', () => ({
	getBskyAgent: mocks.getBskyAgent,
}));

vi.mock('@atproto/syntax', () => ({
	AtUri: mocks.atUri,
}));

import { getBskyNewsListUri, synchBskyList } from '../bsky-list-service';

const server = setupServer();
const apiBaseUrl = 'https://bsky.test/xrpc';
const listUri = 'at://did:plc:owner/app.bsky.graph.list/news-sources';

const sources: Source[] = [
	{ id: 'one', name: 'One News', url: 'https://one.example', bskyDid: 'did:plc:one' },
	{ id: 'two', name: 'Two News', url: 'https://two.example', bskyDid: 'did:plc:two' },
	{ id: 'no-did', name: 'No DID', url: 'https://no-did.example' },
];

const makeAgent = (did = 'did:plc:owner') => ({
	did,
	call: vi.fn(async (_collection: unknown, params: Record<string, string>) => {
		const endpoint = 'actor' in params ? 'app.bsky.graph.getLists' : 'app.bsky.graph.getList';
		return fetch(`${apiBaseUrl}/${endpoint}`).then(response => response.json());
	}),
	create: vi.fn(async (collection: unknown, data: unknown) => {
		const endpoint =
			collection === app.bsky.graph.list ? 'app.bsky.graph.list' : 'app.bsky.graph.listitem';
		return fetch(`${apiBaseUrl}/${endpoint}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ data }),
		}).then(response => response.json());
	}),
	delete: vi.fn(async (_collection: unknown, { rkey }: { rkey: string }) => {
		return fetch(`${apiBaseUrl}/app.bsky.graph.listitem/${rkey}`, { method: 'DELETE' }).then(
			response => response.json()
		);
	}),
});

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterEach(() => {
	server.resetHandlers();
	vi.clearAllMocks();
	mocks.atUri.mockImplementation(function () {
		return { rkey: 'obsolete-rkey' };
	});
});

afterAll(() => server.close());

describe('getBskyNewsListUri', () => {
	test('returns an empty string without an authenticated DID', async () => {
		const agent = makeAgent('');
		mocks.getBskyAgent.mockResolvedValue(agent);

		await expect(getBskyNewsListUri()).resolves.toBe('');
		expect(agent.call).not.toHaveBeenCalled();
	});

	test('returns the existing News Sources list URI', async () => {
		const agent = makeAgent();
		mocks.getBskyAgent.mockResolvedValue(agent);
		server.use(
			http.get(`${apiBaseUrl}/app.bsky.graph.getLists`, () =>
				HttpResponse.json({
					lists: [
						{ name: 'Other list', uri: 'at://did:plc:owner/app.bsky.graph.list/other' },
						{ name: 'News Sources', uri: listUri },
					],
				})
			)
		);

		await expect(getBskyNewsListUri()).resolves.toBe(listUri);
		expect(agent.call).toHaveBeenCalledWith(app.bsky.graph.getLists, { actor: 'did:plc:owner' });
		expect(agent.create).not.toHaveBeenCalled();
	});

	test('creates and returns the list when it does not exist', async () => {
		const agent = makeAgent();
		mocks.getBskyAgent.mockResolvedValue(agent);
		let createPayload:
			| { data: { name: string; description: string; purpose: string; createdAt: string } }
			| undefined;
		server.use(
			http.get(`${apiBaseUrl}/app.bsky.graph.getLists`, () => HttpResponse.json({ lists: [] })),
			http.post(`${apiBaseUrl}/app.bsky.graph.list`, async ({ request }) => {
				createPayload = (await request.json()) as typeof createPayload;
				return HttpResponse.json({ uri: listUri });
			})
		);

		await expect(getBskyNewsListUri()).resolves.toBe(listUri);
		expect(agent.create).toHaveBeenCalledWith(
			app.bsky.graph.list,
			expect.objectContaining({
				purpose: 'app.bsky.graph.defs#curatelist',
				name: 'News Sources',
				description: 'News Sources',
			})
		);
		expect(createPayload?.data.createdAt).toEqual(expect.any(String));
	});
});

describe('synchBskyList', () => {
	test('adds missing source DIDs and deletes obsolete list items', async () => {
		const agent = makeAgent();
		mocks.getBskyAgent.mockResolvedValue(agent);
		const addedDids: string[] = [];
		const deletedRkeys: string[] = [];
		server.use(
			http.get(`${apiBaseUrl}/app.bsky.graph.getLists`, () =>
				HttpResponse.json({ lists: [{ name: 'News Sources', uri: listUri }] })
			),
			http.get(`${apiBaseUrl}/app.bsky.graph.getList`, () =>
				HttpResponse.json({
					items: [
						{
							uri: 'at://did:plc:owner/app.bsky.graph.listitem/current',
							subject: { did: 'did:plc:one' },
						},
						{
							uri: 'at://did:plc:owner/app.bsky.graph.listitem/obsolete',
							subject: { did: 'did:plc:old' },
						},
					],
				})
			),
			http.post(`${apiBaseUrl}/app.bsky.graph.listitem`, async ({ request }) => {
				const { data } = (await request.json()) as { data: { subject: string; list: string } };
				addedDids.push(data.subject);
				expect(data.list).toBe(listUri);
				return HttpResponse.json({ uri: 'at://did:plc:owner/app.bsky.graph.listitem/new' });
			}),
			http.delete(`${apiBaseUrl}/app.bsky.graph.listitem/:rkey`, ({ params }) => {
				deletedRkeys.push(String(params.rkey));
				return HttpResponse.json({});
			})
		);

		await synchBskyList(sources);

		expect(addedDids).toEqual(['did:plc:two']);
		expect(deletedRkeys).toEqual(['obsolete-rkey']);
		expect(agent.create).toHaveBeenCalledTimes(1);
		expect(agent.delete).toHaveBeenCalledWith(app.bsky.graph.listitem, { rkey: 'obsolete-rkey' });
	});

	test('does not mutate a list that already matches the supplied sources', async () => {
		const agent = makeAgent();
		mocks.getBskyAgent.mockResolvedValue(agent);
		server.use(
			http.get(`${apiBaseUrl}/app.bsky.graph.getLists`, () =>
				HttpResponse.json({ lists: [{ name: 'News Sources', uri: listUri }] })
			),
			http.get(`${apiBaseUrl}/app.bsky.graph.getList`, () =>
				HttpResponse.json({
					items: [
						{
							uri: 'at://did:plc:owner/app.bsky.graph.listitem/one',
							subject: { did: 'did:plc:one' },
						},
						{
							uri: 'at://did:plc:owner/app.bsky.graph.listitem/two',
							subject: { did: 'did:plc:two' },
						},
					],
				})
			)
		);

		await synchBskyList(sources);

		expect(agent.create).not.toHaveBeenCalled();
		expect(agent.delete).not.toHaveBeenCalled();
	});
});
