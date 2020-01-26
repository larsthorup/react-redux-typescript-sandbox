import React, { ReactElement } from 'react';
import { App } from './App';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { rootReducer } from './store';

const store = createStore(rootReducer);

export const rootComponent: ReactElement = (
  <Provider store={store}>
    <App />
  </Provider>
);
