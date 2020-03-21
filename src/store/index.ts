import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import { authReducer } from './auth';
import { locationReducer } from './location';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

export const rootReducer = Redux.combineReducers({
  auth: authReducer,
  location: locationReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export type Saga = ThunkAction<void, RootState, unknown, Redux.Action<string>>;
export type Dispatch = ThunkDispatch<RootState, unknown, Redux.Action<string>>;

export const locationSlicer = (state: RootState) => state.location;

// Note: stronger typed hook
export function useSelector<T>(selector: (state: RootState) => T): T {
  return ReactRedux.useSelector(selector);
}

// Note: stronger typed hook
export function useDispatch(): Dispatch {
  return ReactRedux.useDispatch();
}
