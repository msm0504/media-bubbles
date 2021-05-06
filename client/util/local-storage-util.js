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

export const getItemFromStorage = ({ key, type }) => {
	const item = localStorage.getItem(key);
	if (item) {
		return convertToType(item, type);
	}
	return null;
};

export const getItemsFromStorage = storageKeyObjs => {
	return storageKeyObjs.reduce((acc, storageKey) => {
		const item = localStorage.getItem(storageKey.key);
		if (item) {
			acc[storageKey.key] = convertToType(item, storageKey.type);
		}
		return acc;
	}, {});
};

export const setItemInStorage = ({ key, value }) => {
	localStorage.setItem(key, value && typeof value === 'object' ? JSON.stringify(value) : value);
};

export const setItemsInStorage = storageKeyObjs => {
	storageKeyObjs.forEach(setItemInStorage);
};

export const removeItemsFromStorage = keys => keys.map(key => localStorage.removeItem(key));
