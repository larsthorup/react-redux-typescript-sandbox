import { createSlice, SliceReducer } from '../lib/redux-slice';

export type User = {
  name: string;
};

export type AuthState = Readonly<{
  user: User | null;
}>;

const initialState: AuthState = {
  user: null
};

const signin: SliceReducer<AuthState, { user: User }> = (state, { user }) => {
  return { ...state, user };
};

const signout: SliceReducer<AuthState> = state => {
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
