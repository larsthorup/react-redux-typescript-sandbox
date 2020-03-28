import * as R from 'ramda';
import { AnyAction, ActionCreator, createActionCreator } from './redux-action';

// TODO: remove duplication

// SliceReducer can be used to type the reducers in a slice
export type SliceReducer<TState, TPayload = void> = (
  state: TState, // Note: state is never undefined
  action: { payload: TPayload } // Note: action always have payload
) => TState;

// Reducer is used below to type the "reducer" returned by createSlice()
type Reducer<TState> = (state: TState | undefined, action: AnyAction) => TState;

// SliceConfig can be used to type the parameter to createSlice()
type SliceConfig<
  TState,
  TSliceReducers extends {
    [key: string]: SliceReducer<TState, any>;
  }
> = {
  name: string;
  initialState: TState;
  reducers: TSliceReducers;
};

// Slice can be used to type the result of createSlice()
type Slice<
  TState,
  TSliceReducers extends {
    [key: string]: SliceReducer<TState, any>;
  }
> = {
  name: string;
  actions: Actions<TState, TSliceReducers>;
  reducer: Reducer<TState>;
};

// createSlice transforms SliceReducers to Redux-compatible Actions and a Reducer
export const createSlice = <
  TState,
  TSliceReducers extends {
    [key: string]: SliceReducer<TState, any>;
  }
>(
  sliceConfig: SliceConfig<TState, TSliceReducers>
): Slice<TState, TSliceReducers> => {
  const actionCreatorFromReducer = <TPayload>(
    _: any,
    key: string
  ): ActionCreator<TPayload> => {
    return createActionCreator<TPayload>(`${sliceConfig.name}.${key}`);
  };

  const actions = R.mapObjIndexed(
    actionCreatorFromReducer,
    sliceConfig.reducers
  ) as Actions<typeof sliceConfig.initialState, typeof sliceConfig.reducers>;

  const reducerByType = R.fromPairs(
    R.toPairs(
      sliceConfig.reducers
    ).map(
      ([key, reducer]: [string, (state: TState, action: any) => TState]) => [
        `${sliceConfig.name}.${key}`,
        reducer
      ]
    )
  );
  const reducer = (
    state = sliceConfig.initialState,
    action: AnyAction
  ): TState => {
    const reducer = reducerByType[action.type];
    if (reducer) {
      return reducer(state, action);
    } else {
      return state;
    }
  };

  return {
    name: sliceConfig.name,
    actions,
    reducer
  };
};

// Actions is used in Slice to type the "actions" returned by createSlice()
type Actions<
  TState,
  TSliceReducers extends {
    [key: string]: SliceReducer<TState, any>;
  }
> = {
  [Prop in keyof TSliceReducers]: ActionCreator<
    PayloadParameterTypeOf<TSliceReducers[Prop]>
  >;
};

// PayloadParameterTypeOf is used by Actions to extract the type of the "payload" of the "action" parameter of a slice reducer
type PayloadParameterTypeOf<
  TSliceReducer extends SliceReducer<any, any>
> = Parameters<TSliceReducer>[1]['payload'] extends {}
  ? Parameters<TSliceReducer>[1]['payload']
  : void;
