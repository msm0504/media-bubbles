import { combineReducers } from 'redux';
import { HYDRATE } from 'next-redux-wrapper';
import delve from 'dlv';
import dset from 'dset';
import merge from 'merge';

import alertReducer from './alert-reducer';
import formDataReducer from './form-data-reducer';
import searchResultReducer from './search-result-reducer';
import sourceReducer from './source-reducer';

const combinedReducer = combineReducers({
	alertState: alertReducer,
	formDataState: formDataReducer,
	searchResultState: searchResultReducer,
	sourceState: sourceReducer
});

const serverStoreKeys = ['searchResultState.loadedResult', 'searchResultState.latest'];

const rootReducer = (state, action) => {
	if (action.type === HYDRATE) {
		const changedState = {};

		serverStoreKeys.forEach(key => {
			const serverData = delve(action.payload, key);
			if (Object.keys(serverData).length) dset(changedState, key, serverData);
		});

		return merge.recursive(true, state, changedState);
	}
	return combinedReducer(state, action);
};

export default rootReducer;
