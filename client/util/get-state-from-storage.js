const convertToType = (item, type = 'string') => {
	switch (type) {
		case 'json':
			return JSON.parse(item);
		case 'number':
			return +item;
		case 'boolean':
			return item === 'true';
		default:
			return item;
	}
};

const getStateFromStorage = storageKeys => {
	return storageKeys.reduce((acc, storageKey) => {
		const item = localStorage.getItem(storageKey.key);
		if (item) {
			acc[storageKey.key] = convertToType(item, storageKey.type);
		}
		return acc;
	}, {});
};

export default getStateFromStorage;
