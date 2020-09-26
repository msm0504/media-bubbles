import { UIActionTypes } from '../actions/action-types';

const initialState = {};
let nextId = 1;

const alertReducer = (state = initialState, action) => {
	switch (action.type) {
		case UIActionTypes.SHOW_ALERT:
			return {
				...state,
				[nextId++]: { level: action.payload.level, message: action.payload.message }
			};

		case UIActionTypes.HIDE_ALERT: {
			const { [action.payload.alertId]: hiddenAlert, ...otherAlerts } = state;
			return otherAlerts;
		}

		case UIActionTypes.CLEAR_ALERTS:
			return {};

		default:
			return state;
	}
};

export default alertReducer;
