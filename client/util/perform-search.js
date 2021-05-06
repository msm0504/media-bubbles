import Router from 'next/router';

import SourceListToSearchUtil from './source-list-to-search-util';
import ALERT_LEVEL from '../constants/alert-level';
import { SEARCH_MODE_MAP } from '../constants/search-mode';
import { SOURCE_SLANT_MAP } from '../constants/source-slant';
import { callApi } from '../services/api-service';
import { removeItemsFromStorage, setItemsInStorage } from '../util/local-storage-util';

async function performSearch(formData, appSourceList, sourceListBySlant, setContext, showAlert) {
	const errorMessage = getFormErrorMessage(formData);
	if (errorMessage) {
		showAlert(ALERT_LEVEL.danger, errorMessage);
	} else {
		const isSearchAll =
			formData.searchMode === 'FULL_SPECTRUM' && formData.spectrumSearchAll === 'Y';
		const sourceListToSearch = isSearchAll
			? []
			: getNextSourcesToSearch(formData, appSourceList, sourceListBySlant);
		removeItemsFromStorage(['articleMap', 'savedResultId', 'savedResultName']);
		setItemsInStorage([
			{ key: 'sourceListToSearch', value: sourceListToSearch },
			{ key: 'isSearchAll', value: isSearchAll }
		]);

		const requestData = {
			sources: sourceListToSearch.map(source => source.id),
			spectrumSearchAll: formData.spectrumSearchAll,
			keyword: formData.keyword,
			previousDays: formData.previousDays
		};
		const articleMap = await callApi('get', 'headlines', requestData);
		const savedResultName = getSavedResultName(formData);
		setContext({ sourceListToSearch, isSearchAll, articleMap, savedResultName });
		setItemsInStorage([
			{ key: 'articleMap', value: articleMap },
			{ key: 'savedResultName', value: savedResultName }
		]);

		Router.push('/headlines');
	}
}

const getFormErrorMessage = formData => {
	switch (formData.searchMode) {
		case 'MY_BUBBLE':
			if (!formData.sourceSlant) {
				return 'A Political Category Must Be Selected.';
			}
			return '';

		case 'BUBBLE_BURST':
			if (!formData.sourceSlant) {
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

const getNextSourcesToSearch = (formData, appSourceList, sourceListBySlant) => {
	let sourceListToSearch = [];
	switch (formData.searchMode) {
		case 'MY_BUBBLE':
			sourceListToSearch = SourceListToSearchUtil.getMyBubbleSourceList(
				sourceListBySlant,
				formData.sourceSlant
			);
			break;

		case 'BUBBLE_BURST':
			sourceListToSearch = SourceListToSearchUtil.getBubbleBurstSourceList(
				sourceListBySlant,
				formData.sourceSlant
			);
			break;

		case 'FULL_SPECTRUM':
			sourceListToSearch = SourceListToSearchUtil.getCrossSpectrumSourceList(
				sourceListBySlant,
				formData.spectrumSearchAll
			);
			break;

		case 'RANDOM':
			sourceListToSearch = SourceListToSearchUtil.getRandomSourceList(appSourceList);
			break;

		case 'USER_SELECT':
			sourceListToSearch = SourceListToSearchUtil.getUserSelectedSourceList(
				appSourceList,
				formData.selectedSourceIds
			);
			break;
	}

	return sourceListToSearch;
};

const getSavedResultName = formData =>
	`${formData.keyword ? formData.keyword : 'Headlines'} ${
		SEARCH_MODE_MAP[formData.searchMode].name
	}${
		formData.sourceSlant && formData.searchMode.includes('BUBBLE')
			? ` (${SOURCE_SLANT_MAP[formData.sourceSlant]})`
			: ''
	}`;

export default performSearch;
