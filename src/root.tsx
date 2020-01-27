import React, { ReactElement } from 'react';
import { App } from './view/App';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore, Store } from 'redux';
import ReduxThunk from 'redux-thunk';
import * as ReduxHistory from './lib/redux-history';
import { rootReducer, locationSlicer } from './store';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = composeEnhancers(
  applyMiddleware(ReduxThunk),
  applyMiddleware(ReduxHistory.createMiddleware(locationSlicer))
);
const store: Store = createStore(rootReducer, middleware);
ReduxHistory.listen(store);

export const rootComponent: ReactElement = (
  <Provider store={store}>
    <App />
  </Provider>
);
