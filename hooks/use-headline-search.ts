import { useContext, useMemo } from 'react';
import { AlertsDispatch } from '../contexts/alerts-context';
import { SearchResultContext } from '../contexts/search-result-context';
import ALERT_LEVEL from '../constants/alert-level';
import { SEARCH_MODE_MAP } from '../constants/search-mode';
import { SOURCE_SLANT_MAP } from '../constants/source-slant';
import { callApi } from '../services/api-service';
import { removeItemsFromStorage, setItemsInStorage } from '../util/local-storage-util';
import { getNextSourcesToSearch } from '../util/source-list-to-search-util';
import { ArticleMap, SearchFormWithMode, SearchRequest, SearchResult, Source } from '@/types';

const getFormErrorMessage = (formData: SearchFormWithMode) => {
	switch (formData.searchMode) {
		case 'MY_BUBBLE':
			if (formData.sourceSlant === null || typeof formData.sourceSlant === 'undefined') {
				return 'A Political Category Must Be Selected.';
			}
			return '';

		case 'BUBBLE_BURST':
			if (formData.sourceSlant === null || typeof formData.sourceSlant === 'undefined') {
				return 'A Political Category Must Be Selected.';
			}
			return '';

		case 'USER_SELECT':
			if (!formData.selectedSourceIds.length) {
				return 'At Least 1 Source Must Be Selected.';
			}
			return '';

		default:
			return '';
	}
};

const getSavedResultName = (formData: SearchFormWithMode) =>
	`${formData.keyword ? formData.keyword : 'Headlines'} ${
		SEARCH_MODE_MAP[formData.searchMode].name
	}${
		formData.sourceSlant && formData.searchMode?.includes('BUBBLE')
			? ` (${SOURCE_SLANT_MAP[formData.sourceSlant]})`
			: ''
	}`;

const useHeadlineSearch = (appSourceList: Source[], sourceListBySlant: Source[][]) => {
	const [_context, setContext] = useContext(SearchResultContext);
	const showAlert = useContext(AlertsDispatch);

	const validateFormData = useMemo(
		() =>
			(formData: SearchFormWithMode): boolean => {
				const errorMessage = getFormErrorMessage(formData);
				if (errorMessage) {
					showAlert(ALERT_LEVEL.warning, errorMessage);
				}
				return !errorMessage;
			},
		[showAlert]
	);

	const performSearch = useMemo(
		() =>
			async (formData: SearchFormWithMode): Promise<void> => {
				const isSearchAll =
					formData.searchMode === 'FULL_SPECTRUM' && formData.spectrumSearchAll === 'Y';
				const sourceListToSearch = isSearchAll
					? []
					: getNextSourcesToSearch(formData, appSourceList, sourceListBySlant);
				removeItemsFromStorage(['articleMap', 'savedResultId', 'savedResultName']);
				setItemsInStorage([
					{ key: 'sourceListToSearch', value: sourceListToSearch },
					{ key: 'isSearchAll', value: isSearchAll },
				]);

				const requestData: SearchRequest = {
					sources: sourceListToSearch.map(source => source.id).join(),
					spectrumSearchAll: formData.spectrumSearchAll,
					keyword: formData.keyword,
					previousDays: formData.previousDays,
				};
				const articleMap = await callApi<ArticleMap, SearchRequest>(
					'get',
					'headlines',
					requestData
				);
				const savedResultName = getSavedResultName(formData);
				setContext({
					sourceListToSearch,
					isSearchAll,
					articleMap,
					savedResultName,
				} as SearchResult);
				setItemsInStorage([
					{ key: 'articleMap', value: articleMap },
					{ key: 'savedResultName', value: savedResultName },
				]);
				return;
			},
		[appSourceList, setContext, sourceListBySlant]
	);

	return { performSearch, validateFormData };
};

export default useHeadlineSearch;
