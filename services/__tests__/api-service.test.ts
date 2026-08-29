import { afterEach, describe, expect, test, vi } from 'vitest';

import { callApi } from '../api-service';

afterEach(() => vi.restoreAllMocks());

describe('callApi', () => {
	test('sends GET query parameters and parses a successful response', async () => {
		const fetchMock = vi
			.spyOn(global, 'fetch')
			.mockResolvedValue(new Response(JSON.stringify({ items: ['one'] }), { status: 200 }));

		await expect(
			callApi<{ items: string[] }, { search: string }>('GET', 'items', { search: 'news' })
		).resolves.toEqual({
			items: ['one'],
		});
		expect(fetchMock).toHaveBeenCalledWith(
			expect.stringMatching(/\/api\/items\?search=news$/),
			expect.objectContaining({ method: 'GET', headers: expect.any(Object) })
		);
	});

	test('sends POST data as JSON', async () => {
		const fetchMock = vi
			.spyOn(global, 'fetch')
			.mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 201 }));

		await callApi('POST', 'items', { name: 'News' });

		expect(fetchMock).toHaveBeenCalledWith(
			expect.stringMatching(/\/api\/items$/),
			expect.objectContaining({ method: 'POST', body: JSON.stringify({ name: 'News' }) })
		);
	});

	test('rejects unsuccessful responses with their status text', async () => {
		vi.spyOn(global, 'fetch').mockResolvedValue(
			new Response(null, { status: 400, statusText: 'Bad Request' })
		);

		await expect(callApi('GET', 'items')).rejects.toEqual({ errorMessage: 'Bad Request' });
	});
});
