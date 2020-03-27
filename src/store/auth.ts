import * as R from 'ramda';
import { ActionCreator, createActionCreator } from '../lib/redux-action';
import { createSlice } from '../lib/redux-slice';

export type User = {
  name: string;
};

export type AuthState = Readonly<{
  user: User | null;
}>;

const name = 'auth';

const sliceConfig = {
  name,
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
// I would like to be able to write something like this INSIDE the createSlice() function
// to avoid asking users (slice developers) to write the calls to createActionCreator explicitly as done below.
// But I don't know how to make the types TPayload survive from input to output
// const actionCreatorFromReducer = (reducer, key): ActionCreator<TPayload> => {
//   return createActionCreator<TPayload>(`${sliceConfig.name}.${key}`);
// }
// const actions = R.map(actionCreatorFromReducer, sliceConfig.reducers)
type AuthActions = {
  // Note: this demonstrates the type I need slice.actions to have
  signin: ActionCreator<{ user: User }>;
  signout: ActionCreator<void>;
};
// const actions = {
//   signin: createActionCreator<{ user: User }>(`${name}.signin`),
//   signout: createActionCreator<void>(`${name}.signout`)
// } as AuthActions;
const actionCreatorFromReducer = <TPayload>(
  reducer: any, // TODO
  key: string
): ActionCreator<TPayload> => {
  return createActionCreator<TPayload>(`${sliceConfig.name}.${key}`);
};
const actionsG = R.mapObjIndexed(
  actionCreatorFromReducer,
  sliceConfig.reducers
) as AuthActions;

export default createSlice(sliceConfig, actionsG);
