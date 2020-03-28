import { createSlice, Reducer } from '../lib/redux-slice';

export type User = {
  name: string;
};

export type AuthState = Readonly<{
  user: User | null;
}>;

const initialState = {
  user: null
} as AuthState;

const signin: Reducer<AuthState, { user: User }> = (
  state,
  { payload: { user } }
) => {
  return { ...state, user };
};

const signout: Reducer<AuthState> = state => {
  return { ...state, user: null };
};

export default createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signin,
    signout
  }
});
