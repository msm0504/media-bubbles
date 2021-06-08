import { createContext, useState, useEffect } from 'react';

import { getItemsFromStorage, StorageKey } from '../util/local-storage-util';
import { ResultContextType, SearchResult } from '../../types';

const initialState = {
	sourceListToSearch: [],
	isSearchAll: false,
	articleMap: {},
	savedResultId: '',
	savedResultName: ''
};

const storageKeys: StorageKey[] = [
	{ key: 'sourceListToSearch', type: 'json' },
	{ key: 'isSearchAll', type: 'boolean' },
	{ key: 'articleMap', type: 'json' },
	{ key: 'savedResultId' },
	{ key: 'savedResultName' }
];

export const SearchResultContext = createContext<ResultContextType>([{}, () => {}]);

export const SearchResultProvider: React.FC = ({ children }) => {
	const [context, setContext] = useState<SearchResult>(initialState);

	useEffect(() => {
		setContext({ ...context, ...getItemsFromStorage(storageKeys) } as SearchResult);
	}, []);

	return (
		<SearchResultContext.Provider value={[context, setContext]}>
			{children}
		</SearchResultContext.Provider>
	);
};
