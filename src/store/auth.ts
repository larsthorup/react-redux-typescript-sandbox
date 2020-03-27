import * as R from 'ramda';
import { AnyAction, createActionCreator } from '../lib/redux-action';

export type User = {
  name: string;
};

export type AuthState = Readonly<{
  user: User | null;
}>;

const name = 'auth';

const sliceConfig = {
  initialState: {
    user: null
  } as AuthState,
  reducers: {
    signin: (
      state: AuthState,
      { payload: { user } }: { payload: { user: User } }
    ) => {
      return { ...state, user };
    },
    signout: (state: AuthState, action: void) => {
      return { ...state, user: null };
    }
  }
};

// TODO: how to make this generic
// - so that type T is taken from type of sliceConfig.reducers.signin which is Reducer<ActionState, PayloadAction<T>>
// - so that actions.signin is ActionCreator<{user: User}>
const actions = {
  signin: createActionCreator<{ user: User }>(`${name}.signin`),
  signout: createActionCreator<void>(`${name}.signout`)
};

// TODO: extract to redux-slice
const reducerByType = R.fromPairs(
  R.toPairs(
    sliceConfig.reducers
  ).map(
    ([key, reducer]: [
      string,
      (state: AuthState, action: any) => AuthState
    ]) => [`${name}.${key}`, reducer]
  )
);
const reducer = (
  state = sliceConfig.initialState,
  action: AnyAction
): AuthState => {
  const reducer = reducerByType[action.type];
  if (reducer) {
    return reducer(state, action);
  } else {
    return state;
  }
};
export default {
  name,
  actions,
  reducer
};
