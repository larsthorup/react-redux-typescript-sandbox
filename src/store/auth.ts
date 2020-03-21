import { AnyAction, createActionCreator, isType } from '../lib/redux-action';

export type User = {
  name: string;
};

export type AuthState = Readonly<{
  user: User | null;
}>;

const initialState: AuthState = {
  user: null
};

export const signin = createActionCreator<{ user: User }>('AUTH_SIGNIN');
export const signout = createActionCreator('AUTH_SIGNOUT');

export const authReducer = (
  state = initialState,
  action: AnyAction
): AuthState => {
  if (isType(action, signin)) {
    return { ...state, user: action.payload.user };
  } else if (isType(action, signout)) {
    return { ...state, user: null };
  } else {
    return state;
  }
};
