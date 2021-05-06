import { getItemsFromStorage, setItemInStorage } from '../../util/local-storage-util';

export const initialState = {
	keyword: '',
	previousDays: 5,
	sourceSlant: '',
	spectrumSearchAll: '',
	selectedSourceIds: []
};

const storageKeys = [
	{ key: 'keyword' },
	{ key: 'previousDays', type: 'number' },
	{ key: 'sourceSlant' },
	{ key: 'spectrumSearchAll' },
	{ key: 'selectedSourceIds', type: 'json' }
];

export const ACTION_TYPES = {
	LOAD_LOCAL_STORAGE: 'LOAD_LOCAL_STORAGE',
	FORM_FIELD_CHANGED: 'FORM_FIELD_CHANGED',
	SOURCE_SELECTED: 'SOURCE_SELECTED',
	SOURCE_UNSELECTED: 'SOURCE_UNSELECTED'
};

const searchFormReducer = (state = initialState, action) => {
	let selectedSourceIds;

	switch (action.type) {
		case ACTION_TYPES.LOAD_LOCAL_STORAGE:
			return {
				...state,
				...getItemsFromStorage(storageKeys)
			};

		case ACTION_TYPES.FORM_FIELD_CHANGED: {
			const { fieldName, value } = action.payload;
			setItemInStorage({ key: fieldName, value });
			return { ...state, [fieldName]: value };
		}

		case ACTION_TYPES.SOURCE_SELECTED:
			selectedSourceIds = [...state.selectedSourceIds, action.payload.sourceId];
			setItemInStorage({ key: 'selectedSourceIds', value: selectedSourceIds });
			return { ...state, selectedSourceIds };

		case ACTION_TYPES.SOURCE_UNSELECTED:
			selectedSourceIds = [...state.selectedSourceIds];
			selectedSourceIds.splice(state.selectedSourceIds.indexOf(action.payload.sourceId), 1);
			setItemInStorage({ key: 'selectedSourceIds', value: selectedSourceIds });
			return { ...state, selectedSourceIds };

		default:
			return state;
	}
};

export default searchFormReducer;
