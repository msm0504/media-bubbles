const nextJest = require('next/jest');

const createJestConfig = nextJest({
	// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
	dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js', '<rootDir>/test-utils/setup-tests.ts'],
	testEnvironment: 'jest-fixed-jsdom',
	collectCoverageFrom: ['**/*.{ts,tsx}'],
	testEnvironmentOptions: {
		customExportConditions: [''],
	},
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/$1',
		'next-auth/(.*)': '<rootDir>/node_modules/next-auth/$1',
	},
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
