import { AnyAction, createAction, isType } from '../lib/redux-slice';

export type User = {
  name: string;
};

export type AuthState = Readonly<{
  user: User | null;
}>;

const initialState: AuthState = {
  user: null
};

export const signin = createAction<{ user: User }>('AUTH_SIGNIN');
export const signout = createAction('AUTH_SIGNOUT');

export function authReducer(
  state = initialState,
  action: AnyAction
): AuthState {
  if (isType(action, signin)) {
    return { ...state, user: action.payload.user };
  } else if (isType(action, signout)) {
    return { ...state, user: null };
  } else {
    return state;
  }
}
