import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: [{ find: '@', replacement: resolve(__dirname, './') }],
	},
	test: {
		environment: 'jsdom',
		setupFiles: './test-utils/setup-tests.ts',
		coverage: {
			reporter: ['html', 'lcov'],
			all: true,
			extension: ['.ts', '.tsx'],
			exclude: [
				'node_modules/',
				'test-utils/',
				'type-exts/',
				'next-env.d.ts',
				'types.ts',
				'**/__tests__',
				'**/__mocks__',
				'.next/',
				'styles/theme.ts',
			],
		},
	},
});
