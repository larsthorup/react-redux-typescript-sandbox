import * as Redux from 'redux';
import * as ReduxThunk from 'redux-thunk';
import * as ReactRedux from 'react-redux';
import * as ReduxHistory from '../lib/redux-history';
import * as ReactReduxHistory from '../lib/react-redux-history';

import auth from './auth';
import { locationReducer } from './location';

export const rootReducer = Redux.combineReducers({
  auth: auth.reducer,
  location: locationReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export type Selector<T> = (state: RootState) => T;
export type Saga = ReduxThunk.ThunkAction<
  Promise<void>,
  RootState,
  unknown,
  Redux.Action<string>
>;
export type Dispatch = ReduxThunk.ThunkDispatch<
  RootState,
  unknown,
  Redux.Action<string>
>;
export interface Store extends Redux.Store<RootState> {
  dispatch: Dispatch;
}

const locationSlicer = (state: RootState) => state.location;
export const historyMiddleware = ReduxHistory.createMiddleware(locationSlicer);
export const useRoutes = (routes: ReactReduxHistory.Routes) => {
  return ReactReduxHistory.useRoutes(routes, locationSlicer);
};

// Note: stronger typed hook
export const useSelector = <T>(selector: Selector<T>): T => {
  return ReactRedux.useSelector(selector);
};

// Note: stronger typed hook
export const useDispatch = (): Dispatch => {
  return ReactRedux.useDispatch();
};
