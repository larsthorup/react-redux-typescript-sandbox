import React, { ReactElement } from 'react';
import App from './view/App';
import * as ReactRedux from 'react-redux';
import * as Redux from 'redux';
import ReduxThunk from 'redux-thunk';
import * as ReduxHistory from './lib/redux-history';
import { rootReducer, locationSlicer } from './store';

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
const store: Redux.Store = Redux.createStore(rootReducer, middleware);
ReduxHistory.listen(store);

export const rootComponent: ReactElement = (
  <ReactRedux.Provider store={store}>
    <App />
  </ReactRedux.Provider>
);
