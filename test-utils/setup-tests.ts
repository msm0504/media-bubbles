import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { loadEnvConfig } from '@next/env';
import 'whatwg-fetch';

const localStorageMock = {
	getItem: vi.fn(() => null),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn(),
	key: vi.fn(() => ''),
	length: 0,
};

if (typeof global.localStorage !== 'undefined') {
	Object.defineProperty(global, 'localStorage', {
		value: localStorageMock,
		writable: false,
	});
} else {
	global.localStorage = localStorageMock;
}

vi.mock('next/navigation', () => ({
	useRouter: () => ({
		back: () => null,
		forward: () => null,
		prefetch: () => null,
		push: () => null,
		refresh: () => null,
		replace: () => null,
	}),
	usePathname: () => '',
	useSearchParams: () => ({
		get: () => null,
	}),
}));

vi.mock('next/cache', () => ({
	unstable_cache: (fn: () => Promise<unknown>) => () => fn(),
}));

vi.mock('@atproto/api', async importOriginal => {
	const mod: object = await importOriginal();
	return {
		...mod,
		AtpAgent: vi.fn().mockImplementation(() => ({
			login: vi.fn(),
			searchActorsTypeahead: () => fetch('/bsky/searchActorsTypeahead').then(resp => resp.json()),
			getAuthorFeed: () => fetch('/bsky/getAuthorFeed').then(resp => resp.json()),
			session: { did: 'did:user:123' },
			app: {
				bsky: {
					feed: {
						searchPosts: () => fetch('/bsky/searchPosts').then(resp => resp.json()),
						getListFeed: () => fetch('/bsky/getListFeed').then(resp => resp.json()),
					},
					graph: {
						getLists: () => fetch('/bsky/getLists').then(resp => resp.json()),
						getList: () => fetch('/bsky/getList').then(resp => resp.json()),
					},
				},
			},
			com: {
				atproto: {
					repo: {
						createRecord: (body: unknown) =>
							fetch('/bsky/createRecord', { method: 'post', body: JSON.stringify(body) }).then(
								resp => resp.json()
							),
						deleteRecord: () =>
							fetch('/bsky/deleteRecord', { method: 'delete' }).then(resp => resp.json()),
					},
				},
			},
		})),
	};
});

loadEnvConfig(process.cwd());
