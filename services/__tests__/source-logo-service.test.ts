import { afterEach, describe, expect, test, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
	head: vi.fn(),
	put: vi.fn(),
	getSourceLists: vi.fn(),
}));
vi.mock('@vercel/blob', () => ({ head: mocks.head, put: mocks.put }));
vi.mock('../source-list-service', () => ({ getSourceLists: mocks.getSourceLists }));

import { getSourceLogo } from '../source-logo-service';

afterEach(() => {
	vi.clearAllMocks();
	vi.restoreAllMocks();
});

describe('getSourceLogo', () => {
	test('returns stored logos without uploading them again', async () => {
		mocks.head.mockResolvedValue({ url: 'https://blob.test/logo.png' });
		const fetchMock = vi
			.spyOn(global, 'fetch')
			.mockResolvedValue(new Response(new Uint8Array(100), { status: 200 }));

		await expect(getSourceLogo('Example-News')).resolves.toBeInstanceOf(Buffer);
		expect(fetchMock).toHaveBeenCalledWith(
			'https://blob.test/logo.png',
			expect.objectContaining({ method: 'get' })
		);
		expect(mocks.put).not.toHaveBeenCalled();
	});

	test('fetches and stores a missing logo using the source hostname', async () => {
		mocks.head.mockRejectedValue(new Error('missing'));
		mocks.getSourceLists.mockResolvedValue({
			appSourceList: [{ id: 'example', url: 'example.com' }],
		});
		const image = new Uint8Array(100);
		vi.spyOn(global, 'fetch').mockResolvedValue(new Response(image, { status: 200 }));

		await expect(getSourceLogo('example')).resolves.toBeInstanceOf(Buffer);
		expect(mocks.put).toHaveBeenCalledWith('logos/example.png', expect.any(Buffer), {
			access: 'public',
			allowOverwrite: true,
		});
	});

	test('returns null for tiny image responses and errors for unknown sources', async () => {
		mocks.head.mockResolvedValue(null);
		mocks.getSourceLists.mockResolvedValue({
			appSourceList: [{ id: 'example', url: 'example.com' }],
		});
		vi.spyOn(global, 'fetch').mockResolvedValue(new Response(new Uint8Array(10), { status: 200 }));
		await expect(getSourceLogo('example')).resolves.toBeNull();
		mocks.getSourceLists.mockResolvedValue({ appSourceList: [] });
		await expect(getSourceLogo('unknown')).rejects.toThrow(
			'unknown does not match any known sources'
		);
	});
});
