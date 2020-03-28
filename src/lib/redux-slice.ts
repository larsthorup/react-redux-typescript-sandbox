import * as R from 'ramda';
import { AnyAction, ActionCreator, createActionCreator } from './redux-action';

// TODO: remove duplication

// SliceReducer can be used to type the reducers in a slice
export type SliceReducer<TState, TPayload = void> = (
  state: TState, // Note: state is never undefined
  action: { payload: TPayload } // Note: action always have payload
) => TState;

// SliceReducers is used below to restrict the type of a set of reducers in a slice
type SliceReducers<TState> = {
  [key: string]: SliceReducer<TState, any>;
};

// Reducer is used below to type the "reducer" returned by createSlice()
type Reducer<TState> = (state: TState | undefined, action: AnyAction) => TState;

// SliceConfig can be used to type the parameter to createSlice()
type SliceConfig<TState, TSliceReducers extends SliceReducers<TState>> = {
  name: string;
  initialState: TState;
  reducers: TSliceReducers;
};

// Slice can be used to type the result of createSlice()
type Slice<TState, TSliceReducers extends SliceReducers<TState>> = {
  name: string;
  actions: Actions<TState, TSliceReducers>;
  reducer: Reducer<TState>;
};

// createSlice transforms SliceReducers to Redux-compatible Actions and a Reducer
type CreateSlice = <TState, TSliceReducers extends SliceReducers<TState>>(
  sliceConfig: SliceConfig<TState, TSliceReducers>
) => Slice<TState, TSliceReducers>;
export const createSlice: CreateSlice = sliceConfig => {
  const actions = createActions(sliceConfig);
  const reducer = createReducer(sliceConfig);
  return {
    name: sliceConfig.name,
    actions,
    reducer
  };
};

// Actions is used in Slice to type the "actions" returned by createSlice()
type Actions<TState, TSliceReducers extends SliceReducers<TState>> = {
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

const createActions = <TState, TSliceReducers extends SliceReducers<any>>(
  sliceConfig: SliceConfig<TState, TSliceReducers>
): Actions<TState, TSliceReducers> => {
  const actionCreatorFromReducer = <TPayload>(
    _: any,
    key: string
  ): ActionCreator<TPayload> => {
    return createActionCreator<TPayload>(`${sliceConfig.name}.${key}`);
  };

  const actions = R.mapObjIndexed(
    actionCreatorFromReducer,
    sliceConfig.reducers
  ) as Actions<TState, TSliceReducers>;
  return actions;
};

const createReducer = <TState, TSliceReducers extends SliceReducers<any>>(
  sliceConfig: SliceConfig<TState, TSliceReducers>
): Reducer<TState> => {
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
  return reducer;
};
