import { useEffect, useState } from 'react';
import { getItemFromStorage, ItemType, setItemInStorage } from '../util/local-storage-util';

const useLocalStorage = <T>(
	key: string,
	initialValue: T,
	type: ItemType = 'string'
): [T, (value: T) => void] => {
	const [value, setValue] = useState<T>(initialValue);

	useEffect(() => {
		const storedValue = getItemFromStorage({ key, type }) as T;
		if (storedValue) setValue(storedValue);
	}, []);

	const setAndStoreValue = (newValue: T) => {
		setItemInStorage({ key, value: newValue });
		setValue(newValue);
	};

	return [value, setAndStoreValue];
};

export default useLocalStorage;
