import React, { ReactElement } from 'react';
import { App } from './App';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';
import { rootReducer } from './store';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = composeEnhancers(
  applyMiddleware(ReduxThunk)
);
const store = createStore(rootReducer, middleware);

export const rootComponent: ReactElement = (
  <Provider store={store}>
    <App />
  </Provider>
);
