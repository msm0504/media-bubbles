import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createWrapper } from 'next-redux-wrapper';

import rootReducer from '../reducers/root-reducer';
import apiSaga from '../sagas/api-sagas';

export const makeStore = () => {
	const sagaMiddleware = createSagaMiddleware();
	const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
	sagaMiddleware.run(apiSaga);
	return store;
};

export const wrapper = createWrapper(makeStore);
