import { APIActionTypes, UIActionTypes } from '../actions/action-types';
import getStateFromStorage from '../util/get-state-from-storage';
import SourceListToSearchUtil from '../util/source-list-to-search-util';

const initialState = {
	appSourceList: [],
	sourceListBySlant: [],
	sourceListToSearch: []
};

const storageKeys = [{ key: 'sourceListToSearch', type: 'json' }];

const sourceReducer = (state = initialState, action) => {
	switch (action.type) {
		case UIActionTypes.LOAD_LOCAL_STORAGE:
			return {
				...state,
				...getStateFromStorage(storageKeys)
			};

		case APIActionTypes.SOURCE_LISTS_LOADED:
			return {
				...state,
				...action.payload
			};

		case APIActionTypes.SET_SOURCES_TO_SEARCH: {
			let sourceListToSearch = [];
			switch (action.payload.formData.searchMode) {
				case 'MY_BUBBLE':
					sourceListToSearch = SourceListToSearchUtil.getMyBubbleSourceList(
						state.sourceListBySlant,
						action.payload.formData.sourceSlant
					);
					break;

				case 'BUBBLE_BURST':
					sourceListToSearch = SourceListToSearchUtil.getBubbleBurstSourceList(
						state.sourceListBySlant,
						action.payload.formData.sourceSlant
					);
					break;

				case 'FULL_SPECTRUM':
					sourceListToSearch = SourceListToSearchUtil.getCrossSpectrumSourceList(
						state.sourceListBySlant,
						action.payload.formData.spectrumSearchAll
					);
					break;

				case 'RANDOM':
					sourceListToSearch = SourceListToSearchUtil.getRandomSourceList(state.appSourceList);
					break;

				case 'USER_SELECT':
					sourceListToSearch = SourceListToSearchUtil.getUserSelectedSourceList(
						state.appSourceList,
						action.payload.formData.selectedSourceIds
					);
					break;
			}

			localStorage.setItem('sourceListToSearch', JSON.stringify(sourceListToSearch));
			return { ...state, sourceListToSearch };
		}

		case APIActionTypes.CLEAR_SOURCES_TO_SEARCH:
			localStorage.removeItem('sourceListToSearch');
			return { ...state, sourceListToSearch: [] };

		default:
			return state;
	}
};

export default sourceReducer;
