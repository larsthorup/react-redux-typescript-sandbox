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
export function signin(payload: AuthState) {
  return {
    type: AUTH_SIGNIN,
    payload
  };
}
signin.displayName = AUTH_SIGNIN;
signin.toString = () => AUTH_SIGNIN;
signin.type = 'AUTH_SIGNIN' as const;

const AUTH_SIGNOUT = 'AUTH_SIGNOUT';
interface AuthSignoutAction {
  type: typeof AUTH_SIGNOUT;
  payload: null
}
export function signout(payload: null = null) {
  return {
    type: AUTH_SIGNOUT,
    payload
  };
}
signout.displayName = AUTH_SIGNOUT;
signout.toString = () => AUTH_SIGNOUT;
signout.type = 'AUTH_SIGNOUT' as const;

type AuthActionTypes = AuthSigninAction | AuthSignoutAction;

export function authReducer(
  state = initialState,
  action: AuthActionTypes
): AuthState {
  switch (action.type) {
    case signin.type:
      return { ...state, user: action.payload.user };
    case signout.type:
      return { ...state, user: null };
    default:
      return state;
  }
}
