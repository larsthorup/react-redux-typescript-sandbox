import {
  AnyAction,
  createActionCreator,
  PayloadAction,
  AnyActionCreator
} from '../lib/redux-action';

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
      { payload: { user } }: PayloadAction<{ user: User }>
    ) => {
      return { ...state, user };
    },
    signout: (state: AuthState, action: PayloadAction<void>) => {
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
const actionCreatorByKey = actions as { [key: string]: AnyActionCreator };
const reducerByType = sliceConfig.reducers as {
  [key: string]: (state: AuthState, action: any) => AuthState;
};
const reducer = (
  state = sliceConfig.initialState,
  action: AnyAction
): AuthState => {
  const hasSameType = (key: string) => {
    const actionCreator = actionCreatorByKey[key];
    return actionCreator.type === action.type;
  };
  const type = Object.keys(sliceConfig.reducers).find(hasSameType);
  if (type) {
    const reducer = reducerByType[type];
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
