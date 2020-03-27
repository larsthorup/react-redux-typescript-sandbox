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

// TODO: how to extract this into redux-slice
type Actions<
  TState,
  TSliceReducers extends {
    [key: string]: (state: TState, action: any) => TState;
  }
> = {
  [Prop in keyof TSliceReducers]: ActionCreator<
    Parameters<TSliceReducers[Prop]>[1]['payload'] extends {}
      ? Parameters<TSliceReducers[Prop]>[1]['payload']
      : void
  >;
};

const actionCreatorFromReducer = <TPayload>(
  _: any,
  key: string
): ActionCreator<TPayload> => {
  return createActionCreator<TPayload>(`${sliceConfig.name}.${key}`);
};

const actionsG = R.mapObjIndexed(
  actionCreatorFromReducer,
  sliceConfig.reducers
) as Actions<typeof sliceConfig.initialState, typeof sliceConfig.reducers>;

export default createSlice(sliceConfig, actionsG);
