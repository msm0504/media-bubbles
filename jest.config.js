module.exports = {
	roots: ['<rootDir>'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx'],
	testPathIgnorePatterns: ['<rootDir>[/\\\\](node_modules|.next)[/\\\\]'],
	transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(ts|tsx)$'],
	transform: {
		'^.+\\.(ts|tsx)$': 'babel-jest'
	},
	moduleNameMapper: {
		'\\.(css|less|sass|scss)$': 'identity-obj-proxy'
	},
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['<rootDir>/test-utils/setup-tests.ts'],
	collectCoverageFrom: ['**/client/**/*.{ts,tsx}', '**/pages/**/*.{ts,tsx}', '**/server/**/*.ts']
};
