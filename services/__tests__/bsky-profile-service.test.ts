import { afterEach, describe, expect, test, vi } from 'vitest';
import { app } from '@bsky/sdk/lexicons';

const mocks = vi.hoisted(() => ({ getBskyPublicAgent: vi.fn() }));

vi.mock('@/connections/bsky-agent', () => ({ getBskyPublicAgent: mocks.getBskyPublicAgent }));

import { getBskyProfile } from '../bsky-profile-service';

afterEach(() => vi.clearAllMocks());

describe('getBskyProfile', () => {
	test('uses the BBC-specific lookup and returns its BBC News result', async () => {
		const bbcNews = { handle: 'bbcnews.com', did: 'did:plc:bbc' };
		const agent = {
			call: vi.fn().mockResolvedValue({ actors: [{ handle: 'bbc.co.uk' }, bbcNews] }),
		};
		mocks.getBskyPublicAgent.mockReturnValue(agent);

		await expect(getBskyProfile('BBC News', 'bbc.com')).resolves.toBe(bbcNews);
		expect(agent.call).toHaveBeenCalledWith(app.bsky.actor.searchActorsTypeahead, {
			q: 'bbcnews',
			limit: 5,
		});
	});

	test('returns the first URL match without searching by name', async () => {
		const profile = { handle: 'example.com', did: 'did:plc:example' };
		const agent = { call: vi.fn().mockResolvedValue({ actors: [profile] }) };
		mocks.getBskyPublicAgent.mockReturnValue(agent);

		await expect(getBskyProfile('Example News', 'example.com')).resolves.toBe(profile);
		expect(agent.call).toHaveBeenCalledTimes(1);
		expect(agent.call).toHaveBeenCalledWith(app.bsky.actor.searchActorsTypeahead, {
			q: 'example.com',
			limit: 5,
		});
	});

	test('falls back to a name lookup when the URL has no matches', async () => {
		const profile = { handle: 'example-news.bsky.social', did: 'did:plc:example' };
		const agent = {
			call: vi
				.fn()
				.mockResolvedValueOnce({ actors: [] })
				.mockResolvedValueOnce({ actors: [profile] }),
		};
		mocks.getBskyPublicAgent.mockReturnValue(agent);

		await expect(getBskyProfile('Example News', 'example.com')).resolves.toBe(profile);
		expect(agent.call).toHaveBeenLastCalledWith(app.bsky.actor.searchActorsTypeahead, {
			q: 'Example News',
			limit: 5,
		});
	});
});
