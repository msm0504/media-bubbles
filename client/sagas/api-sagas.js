import Router from 'next/router';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import { APIActionTypes, UIActionTypes } from '../actions/action-types';
import APIActions from '../actions/api-actions';
import UIActions from '../actions/ui-actions';
import ALERT_LEVEL from '../constants/alert-level';
import APIService from '../services/api-service';

function* getSourceLists() {
	const { appSourceList, sourceListBySlant } = yield call(
		[APIService, APIService.callApi],
		'get',
		'source-lists'
	);
	yield put(APIActions.sourceListsLoaded(appSourceList, sourceListBySlant));
}

function* watchGetSourceLists() {
	yield takeEvery(APIActionTypes.GET_SOURCE_LISTS, getSourceLists);
}

function* getArticleLists(action) {
	const formData = action.payload.formData;
	const errorMessage = getFormErrorMessage(formData);
	if (errorMessage) {
		yield put(UIActions.showAlert(ALERT_LEVEL.danger, errorMessage));
	} else {
		const isSearchAll =
			formData.searchMode === 'FULL_SPECTRUM' && formData.spectrumSearchAll === 'Y';
		yield put(
			isSearchAll ? APIActions.clearSourcesToSearch() : APIActions.setSourcesToSearch(formData)
		);
		yield put(UIActions.newSearchStarted(isSearchAll));
		const sourceListToSearch = yield select(getSourceListToSearch);
		const requestData = {
			sources: sourceListToSearch.map(source => source.id),
			spectrumSearchAll: formData.spectrumSearchAll,
			keyword: formData.keyword,
			onlySearchTitles: formData.onlySearchTitles,
			previousDays: formData.previousDays,
			sortBy: formData.sortBy
		};
		const articleMap = yield call(
			[APIService, APIService.callApi],
			'get',
			'headlines',
			requestData
		);
		yield put(APIActions.articleListsLoaded(articleMap));
		yield Router.push('/headlines');
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

const getSourceListToSearch = state => state.sourceState.sourceListToSearch;

function* watchSearchFormSubmit() {
	yield takeEvery(UIActionTypes.SEARCH_FORM_SUBMIT, getArticleLists);
}

function* handleSaveResult(action) {
	const { savedResultId } = yield call(
		[APIService, APIService.callApi],
		'post',
		'searchResult',
		action.payload
	);

	if (!savedResultId || typeof savedResultId !== 'string') {
		yield put(
			UIActions.showAlert(
				ALERT_LEVEL.danger,
				'Saving this search result failed. Please try again later.'
			)
		);
	} else {
		yield put(UIActions.showAlert(ALERT_LEVEL.success, 'Search result saved successfully.'));
		yield put(APIActions.resultSaved(savedResultId));
	}
}

function* watchSaveResultClicked() {
	yield takeEvery(UIActionTypes.SAVE_RESULT, handleSaveResult);
}

function* handleSubmitFeedback(action) {
	const { feedbackSent } = yield call(
		[APIService, APIService.callApi],
		'post',
		'feedback',
		action.payload.feedbackData
	);

	if (feedbackSent !== true) {
		yield put(
			UIActions.showAlert(
				ALERT_LEVEL.danger,
				'Sending this message failed. Please try again later.'
			)
		);
	} else {
		yield put(UIActions.showAlert(ALERT_LEVEL.success, 'Message sent successfully.'));
	}
}

function* watchSubmitFeedback() {
	yield takeEvery(UIActionTypes.SUBMIT_FEEDBACK, handleSubmitFeedback);
}

export default function* apiSaga() {
	yield all([
		watchGetSourceLists(),
		watchSearchFormSubmit(),
		watchSaveResultClicked(),
		watchSubmitFeedback()
	]);
}
