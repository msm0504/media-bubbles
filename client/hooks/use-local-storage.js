import { useEffect, useState } from 'react';
import { getItemFromStorage, setItemInStorage } from '../util/local-storage-util';

const useLocalStorage = (key, initialValue, type = 'string') => {
	const [value, setValue] = useState(initialValue);

	useEffect(() => {
		const storedValue = getItemFromStorage({ key, type });
		if (storedValue) setValue(storedValue);
	}, []);

	const setAndStoreValue = newValue => {
		setItemInStorage({ key, value: newValue });
		setValue(newValue);
	};

	return [value, setAndStoreValue];
};

export default useLocalStorage;
