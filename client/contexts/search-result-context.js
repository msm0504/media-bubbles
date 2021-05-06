import { createContext, useState, useEffect } from 'react';

import { getItemsFromStorage } from '../util/local-storage-util';

const initialState = {
	sourceListToSearch: [],
	isSearchAll: false,
	articleMap: {},
	savedResultId: '',
	savedResultName: ''
};

const storageKeys = [
	{ key: 'sourceListToSearch', type: 'json' },
	{ key: 'isSearchAll', type: 'boolean' },
	{ key: 'articleMap', type: 'json' },
	{ key: 'savedResultId' },
	{ key: 'savedResultName' }
];

export const SearchResultContext = createContext([{}, () => {}]);

export const SearchResultProvider = ({ children }) => {
	const [context, setContext] = useState(initialState);

	useEffect(() => {
		setContext({ ...context, ...getItemsFromStorage(storageKeys) });
	}, []);

	return (
		<SearchResultContext.Provider value={[context, setContext]}>
			{children}
		</SearchResultContext.Provider>
	);
};
