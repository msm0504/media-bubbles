import { APIActionTypes, UIActionTypes } from '../actions/action-types';
import getStateFromStorage from '../util/get-state-from-storage';

const initialState = {
	fbUserId: null,
	fbName: '',
	fbEmail: '',
	fbInitComplete: false
};

const storageKeys = [{ key: 'userInfo', type: 'json' }];

const loginReducer = (state = initialState, action) => {
	switch (action.type) {
		case UIActionTypes.LOAD_LOCAL_STORAGE:
			return {
				...state,
				...getStateFromStorage(storageKeys).userInfo
			};

		case APIActionTypes.FB_INIT_COMPLETE: {
			return {
				...state,
				fbInitComplete: true
			};
		}

		case APIActionTypes.FB_USER_CHANGED: {
			const newState = { ...state, fbUserId: action.payload.userId };
			localStorage.setItem('userInfo', JSON.stringify(newState));
			return newState;
		}

		case APIActionTypes.SET_FB_USER_DATA: {
			const newState = {
				...state,
				fbName: action.payload.userData.name || '',
				fbEmail: action.payload.userData.email || ''
			};
			localStorage.setItem('userInfo', JSON.stringify(newState));
			return newState;
		}

		case APIActionTypes.CLEAR_FB_USER_DATA:
			localStorage.removeItem('userInfo');
			return { ...state, fbUserId: null, fbName: '', fbEmail: '' };

		default:
			return state;
	}
};

export default loginReducer;
