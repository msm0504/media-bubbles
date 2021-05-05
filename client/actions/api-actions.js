import { APIActionTypes } from './action-types';

class APIActions {
	getSourceLists() {
		return {
			type: APIActionTypes.GET_SOURCE_LISTS
		};
	}

	sourceListsLoaded(appSourceList, sourceListBySlant) {
		return {
			type: APIActionTypes.SOURCE_LISTS_LOADED,
			payload: {
				appSourceList,
				sourceListBySlant
			}
		};
	}

	setSourcesToSearch(formData) {
		return {
			type: APIActionTypes.SET_SOURCES_TO_SEARCH,
			payload: {
				formData
			}
		};
	}

	clearSourcesToSearch() {
		return {
			type: APIActionTypes.CLEAR_SOURCES_TO_SEARCH
		};
	}

	articleListsLoaded(articleMap) {
		return {
			type: APIActionTypes.ARTICLE_LISTS_LOADED,
			payload: {
				articleMap
			}
		};
	}

	resultSaved(savedResultId) {
		return {
			type: APIActionTypes.RESULT_SAVED,
			payload: {
				savedResultId
			}
		};
	}

	resultLoaded(loadedResult) {
		return {
			type: APIActionTypes.RESULT_LOADED,
			payload: {
				loadedResult
			}
		};
	}
}

export default new APIActions();
