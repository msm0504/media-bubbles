const localStorageMock = {
	getItem: jest.fn(() => null),
	setItem: jest.fn(),
	removeItem: jest.fn(),
	clear: jest.fn(),
	key: jest.fn(() => ''),
	length: 0
};

if (typeof global.localStorage !== 'undefined') {
	Object.defineProperty(global, 'localStorage', {
		value: localStorageMock,
		writable: false
	});
} else {
	global.localStorage = localStorageMock;
}

export {};
