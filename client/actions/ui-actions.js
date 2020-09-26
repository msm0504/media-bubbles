import { UIActionTypes } from './action-types';

class UIActions {
	loadLocalStorage() {
		return {
			type: UIActionTypes.LOAD_LOCAL_STORAGE
		};
	}

	formFieldChanged(fieldName, value) {
		return {
			type: UIActionTypes.FORM_FIELD_CHANGED,
			payload: {
				fieldName,
				value
			}
		};
	}

	sourceSelected(sourceId) {
		return {
			type: UIActionTypes.SOURCE_SELECTED,
			payload: {
				sourceId
			}
		};
	}

	sourceUnselected(sourceId) {
		return {
			type: UIActionTypes.SOURCE_UNSELECTED,
			payload: {
				sourceId
			}
		};
	}

	showAlert(level, message) {
		return {
			type: UIActionTypes.SHOW_ALERT,
			payload: {
				level,
				message
			}
		};
	}

	hideAlert(alertId) {
		return {
			type: UIActionTypes.HIDE_ALERT,
			payload: {
				alertId
			}
		};
	}

	clearAlerts() {
		return {
			type: UIActionTypes.CLEAR_ALERTS
		};
	}

	searchFormSubmit(formData) {
		return {
			type: UIActionTypes.SEARCH_FORM_SUBMIT,
			payload: {
				formData
			}
		};
	}

	newSearchStarted(isSearchAll) {
		return {
			type: UIActionTypes.NEW_SEARCH_STARTED,
			payload: {
				isSearchAll
			}
		};
	}

	panelOpened(panelId, displayedStateName) {
		return {
			type: UIActionTypes.PANEL_OPENED,
			payload: {
				panelId,
				displayedStateName
			}
		};
	}

	panelClosed(panelId, displayedStateName) {
		return {
			type: UIActionTypes.PANEL_CLOSED,
			payload: {
				panelId,
				displayedStateName
			}
		};
	}

	saveResult(name, articleMap, isSearchAll, sourceList) {
		return {
			type: UIActionTypes.SAVE_RESULT,
			payload: {
				name,
				articleMap,
				isSearchAll,
				sourceList
			}
		};
	}

	submitFeedback(feedbackData) {
		return {
			type: UIActionTypes.SUBMIT_FEEDBACK,
			payload: {
				feedbackData: feedbackData
			}
		};
	}
}

export default new UIActions();
