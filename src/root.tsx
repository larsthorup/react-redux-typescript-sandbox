import React, { ReactElement } from 'react';
import App from './view/App';
import * as ReactRedux from 'react-redux';
import * as Redux from 'redux';
import ReduxThunk from 'redux-thunk';
import * as ReduxHistory from './lib/redux-history';
import { rootReducer, locationSlicer, RootState } from './store';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof Redux.compose;
  }
}
const composeEnhancers =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || Redux.compose;
const middleware = composeEnhancers(
  Redux.applyMiddleware(ReduxThunk),
  Redux.applyMiddleware(ReduxHistory.createMiddleware(locationSlicer))
);

export const createRootElement: () => ReactElement = () => {
  const store = setupStore();
  return connect(<App />, store);
};

export const setupStore: () => Redux.Store<RootState> = () => {
  const store: Redux.Store<RootState> = Redux.createStore(
    rootReducer,
    middleware
  );
  ReduxHistory.listen(store);
  return store;
};

export const connect: (
  element: ReactElement,
  store: Redux.Store<RootState>
) => ReactElement = (element, store) => {
  return <ReactRedux.Provider store={store}>{element}</ReactRedux.Provider>;
};
