export type User = {
  name: string;
};

export type AuthState = Readonly<{
  user: User | null;
}>;

const initialState: AuthState = {
  user: null
};

const AUTH_SIGNIN = 'AUTH_SIGNIN';
interface AuthSigninAction {
  type: typeof AUTH_SIGNIN;
  payload: AuthState;
}
export function signin(user: User) {
  return {
    type: AUTH_SIGNIN,
    payload: { user }
  };
}

const AUTH_SIGNOUT = 'AUTH_SIGNOUT';
interface AuthSignoutAction {
  type: typeof AUTH_SIGNOUT;
}
export function signout() {
  return {
    type: AUTH_SIGNOUT
  };
}

export type AuthActionTypes = AuthSigninAction | AuthSignoutAction;

export function authReducer(
  state = initialState,
  action: AuthActionTypes
): AuthState {
  switch (action.type) {
    case AUTH_SIGNIN:
      return { ...state, user: action.payload.user };
    case AUTH_SIGNOUT:
      return { ...state, user: null };
    default:
      return state;
  }
}
