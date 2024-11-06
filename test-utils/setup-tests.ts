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

loadEnvConfig(process.cwd());
