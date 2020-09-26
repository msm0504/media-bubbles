import { UIActionTypes } from '../actions/action-types';
import SEARCH_MODE from '../constants/search-mode';
import getStateFromStorage from '../util/get-state-from-storage';

const initialState = {
	searchMode: SEARCH_MODE[0].id,
	keyword: '',
	onlySearchTitles: 'N',
	previousDays: 5,
	sortBy: 'relevancy',
	sourceSlant: '',
	spectrumSearchAll: '',
	selectedSourceIds: []
};

const storageKeys = [
	{ key: 'searchMode' },
	{ key: 'keyword' },
	{ key: 'onlySearchTitles' },
	{ key: 'previousDays', type: 'number' },
	{ key: 'sortBy' },
	{ key: 'sourceSlant' },
	{ key: 'spectrumSearchAll' },
	{ key: 'selectedSourceIds', type: 'json' }
];

const formDataReducer = (state = initialState, action) => {
	let selectedSourceIds;

	switch (action.type) {
		case UIActionTypes.LOAD_LOCAL_STORAGE:
			return {
				...state,
				...getStateFromStorage(storageKeys)
			};

		case UIActionTypes.FORM_FIELD_CHANGED: {
			const { fieldName, value } = action.payload;
			localStorage.setItem(fieldName, value);
			return { ...state, [fieldName]: value };
		}

		case UIActionTypes.SOURCE_SELECTED:
			selectedSourceIds = [...state.selectedSourceIds, action.payload.sourceId];
			localStorage.setItem('selectedSourceIds', JSON.stringify(selectedSourceIds));
			return { ...state, selectedSourceIds };

		case UIActionTypes.SOURCE_UNSELECTED:
			selectedSourceIds = [...state.selectedSourceIds];
			selectedSourceIds.splice(state.selectedSourceIds.indexOf(action.payload.sourceId), 1);
			localStorage.setItem('selectedSourceIds', JSON.stringify(selectedSourceIds));
			return { ...state, selectedSourceIds };

		default:
			return state;
	}
};

export default formDataReducer;
