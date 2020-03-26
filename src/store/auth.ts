import {
  AnyAction,
  createActionCreator,
  isType,
  PayloadAction
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

const actions = {
  signin: createActionCreator<{ user: User }>(`${name}.signin`),
  signout: createActionCreator<void>(`${name}.signout`)
};
export default {
  name,
  actions,
  reducer: (state = sliceConfig.initialState, action: AnyAction): AuthState => {
    if (isType(action, actions.signin)) {
      return sliceConfig.reducers.signin(state, action);
    } else if (isType(action, actions.signout)) {
      return sliceConfig.reducers.signout(state, action);
    } else {
      return state;
    }
  }
};
