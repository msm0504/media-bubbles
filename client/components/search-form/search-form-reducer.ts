import * as ACTION_TYPES from './action-types';
import { SourceSlant } from '@/client/constants/source-slant';
import {
	getItemsFromStorage,
	setItemInStorage,
	StorageKey
} from '@/client/util/local-storage-util';
import { SearchFormState } from '@/types';

type LocalStorageAction = {
	type: typeof ACTION_TYPES.LOAD_LOCAL_STORAGE;
};

export type FieldValue = string | number | SourceSlant;
type FieldChangeAction = {
	type: typeof ACTION_TYPES.FORM_FIELD_CHANGED;
	payload: {
		fieldName: string;
		value: FieldValue;
	};
};

type CheckboxChangeAction = {
	type: typeof ACTION_TYPES.SOURCE_SELECTED | typeof ACTION_TYPES.SOURCE_UNSELECTED;
	payload: {
		sourceId: string;
	};
};

type SearchFormAction = LocalStorageAction | FieldChangeAction | CheckboxChangeAction;

export const initialState: SearchFormState = {
	keyword: '',
	previousDays: 5,
	selectedSourceIds: [],
	spectrumSearchAll: 'Y'
};

const storageKeys: StorageKey[] = [
	{ key: 'keyword' },
	{ key: 'previousDays', type: 'number' },
	{ key: 'sourceSlant' },
	{ key: 'spectrumSearchAll' },
	{ key: 'selectedSourceIds', type: 'json' }
];

const searchFormReducer = (state = initialState, action: SearchFormAction): SearchFormState => {
	let selectedSourceIds: string[];

	switch (action.type) {
		case ACTION_TYPES.LOAD_LOCAL_STORAGE:
			return {
				...state,
				...getItemsFromStorage(storageKeys)
			};

		case ACTION_TYPES.FORM_FIELD_CHANGED: {
			const { fieldName, value } = action.payload || {};
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
