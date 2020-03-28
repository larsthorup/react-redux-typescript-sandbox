import * as R from 'ramda';
import { AnyAction, ActionCreator, createActionCreator } from './redux-action';

// TODO: remove duplication

export type Reducer<TState, TPayload = void> = (
  state: TState,
  action: { payload: TPayload }
) => TState;

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

type SliceConfig<
  TState,
  TSliceReducers extends {
    [key: string]: (state: TState, action: any) => TState;
  }
> = {
  name: string;
  initialState: TState;
  reducers: TSliceReducers;
};

type Slice<TState, TActions> = {
  name: string;
  actions: TActions;
  reducer: (state: TState | undefined, action: AnyAction) => TState;
};

export const createSlice = <
  TState,
  TSliceReducers extends {
    [key: string]: (state: TState, action: any) => TState;
  }
>(
  sliceConfig: SliceConfig<TState, TSliceReducers>
): Slice<TState, Actions<TState, TSliceReducers>> => {
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
