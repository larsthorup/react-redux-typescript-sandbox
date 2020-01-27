import { combineReducers } from 'redux';
import { authReducer } from './auth';
import { locationReducer } from './location';

export const rootReducer = combineReducers({
  auth: authReducer,
  location: locationReducer
});

export type RootState = ReturnType<typeof rootReducer>;
