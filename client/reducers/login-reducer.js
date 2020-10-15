import { APIActionTypes, UIActionTypes } from '../actions/action-types';
import getStateFromStorage from '../util/get-state-from-storage';

const initialState = {
	fbUserInfo: {
		userId: null,
		name: '',
		email: ''
	},
	fbInitComplete: false
};

const storageKeys = [{ key: 'fbUserInfo', type: 'json' }];

const loginReducer = (state = initialState, action) => {
	switch (action.type) {
		case UIActionTypes.LOAD_LOCAL_STORAGE:
			return {
				...state,
				...getStateFromStorage(storageKeys)
			};

		case APIActionTypes.FB_INIT_COMPLETE: {
			return {
				...state,
				fbInitComplete: true
			};
		}

		case APIActionTypes.FB_USER_CHANGED: {
			const newState = {
				...state,
				fbUserInfo: { ...state.fbUserInfo, userId: action.payload.userId }
			};
			localStorage.setItem('fbUserInfo', JSON.stringify(newState.fbUserInfo));
			return newState;
		}

		case APIActionTypes.SET_FB_USER_DATA: {
			const newState = {
				...state,
				fbUserInfo: {
					...state.fbUserInfo,
					name: action.payload.userData.name || '',
					email: action.payload.userData.email || ''
				}
			};
			localStorage.setItem('fbUserInfo', JSON.stringify(newState.fbUserInfo));
			return newState;
		}

		case APIActionTypes.CLEAR_FB_USER_DATA:
			localStorage.removeItem('fbUserInfo');
			return {
				...state,
				fbUserInfo: { userId: null, name: '', email: '' }
			};

		default:
			return state;
	}
};

export default loginReducer;
