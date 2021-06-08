export type ItemType = 'string' | 'number' | 'boolean' | 'json';
export type StorageKey = { key: string; type?: ItemType };
export type StorageItem = { key: string; value: unknown };

const convertToType = (item: string, type = 'string') => {
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

export const getItemFromStorage = ({ key, type }: StorageKey): unknown => {
	const item = localStorage.getItem(key);
	if (item) {
		return convertToType(item, type);
	}
	return null;
};

export const getItemsFromStorage = (storageKeyObjs: StorageKey[]): { [key: string]: unknown } => {
	return storageKeyObjs.reduce((acc: Record<string, unknown>, storageKey) => {
		const item = localStorage.getItem(storageKey.key);
		if (item) {
			acc[storageKey.key] = convertToType(item, storageKey.type);
		}
		return acc;
	}, {});
};

export const setItemInStorage = ({ key, value }: StorageItem): void => {
	localStorage.setItem(
		key,
		value && typeof value === 'object' ? JSON.stringify(value) : '' + value
	);
};

export const setItemsInStorage = (storageItemObjs: StorageItem[]): void => {
	storageItemObjs.forEach(setItemInStorage);
};

export const removeItemsFromStorage = (keys: string[]): void =>
	keys.forEach(key => localStorage.removeItem(key));
