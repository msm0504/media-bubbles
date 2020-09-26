import { UIActionTypes, APIActionTypes } from '../actions/action-types';
import getStateFromStorage from '../util/get-state-from-storage';

const initialState = {
	newSearch: {
		openPanels: [],
		articleMap: {},
		savedResultId: null,
		isSearchAll: false
	},
	loadedResult: {}
};

const storageKeys = [
	{ key: 'openPanels', type: 'json' },
	{ key: 'articleMap', type: 'json' },
	{ key: 'savedResultId' },
	{ key: 'isSearchAll', type: 'boolean' }
];

const searchResultReducer = (state = initialState, action) => {
	let openPanels;

	switch (action.type) {
		case UIActionTypes.LOAD_LOCAL_STORAGE:
			return {
				...state,
				newSearch: {
					...state.newSearch,
					...getStateFromStorage(storageKeys)
				}
			};

		case UIActionTypes.NEW_SEARCH_STARTED:
			localStorage.removeItem('openPanels');
			localStorage.removeItem('articleMap');
			localStorage.removeItem('savedResultId');
			localStorage.setItem('isSearchAll', action.payload.isSearchAll.toString());
			return {
				...state,
				newSearch: {
					...state.newSearch,
					openPanels: [],
					articleMap: {},
					savedResultId: null,
					isSearchAll: action.payload.isSearchAll
				}
			};

		case UIActionTypes.PANEL_OPENED: {
			const { panelId, displayedStateName } = action.payload;
			const displayedState = state[displayedStateName];
			openPanels = [...displayedState.openPanels, panelId];
			if (displayedStateName === 'newSearch') {
				localStorage.setItem('openPanels', JSON.stringify(openPanels));
			}
			return { ...state, [displayedStateName]: { ...displayedState, openPanels } };
		}

		case UIActionTypes.PANEL_CLOSED: {
			const { panelId, displayedStateName } = action.payload;
			const displayedState = state[displayedStateName];
			openPanels = [...displayedState.openPanels];
			openPanels.splice(displayedState.openPanels.indexOf(panelId), 1);
			if (displayedStateName === 'newSearch') {
				localStorage.setItem('openPanels', JSON.stringify(openPanels));
			}
			return { ...state, [displayedStateName]: { ...displayedState, openPanels } };
		}

		case APIActionTypes.ARTICLE_LISTS_LOADED:
			localStorage.setItem('articleMap', JSON.stringify(action.payload.articleMap));
			return { ...state, newSearch: { ...state.newSearch, articleMap: action.payload.articleMap } };

		case APIActionTypes.RESULT_SAVED:
			localStorage.setItem('savedResultId', action.payload.savedResultId);
			return {
				...state,
				newSearch: { ...state.newSearch, savedResultId: action.payload.savedResultId }
			};

		case APIActionTypes.RESULT_LOADED: {
			const { loadedResult } = action.payload;
			return {
				...state,
				loadedResult: {
					openPanels: [],
					articleMap: loadedResult.articleMap,
					savedResultId: loadedResult._id,
					isSearchAll: loadedResult.isSearchAll,
					sourceList: loadedResult.sourceList
				}
			};
		}

		default:
			return state;
	}
};

export default searchResultReducer;
