import * as R from 'ramda';
import { AnyAction, ActionCreator } from './redux-action';

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
  sliceConfig: SliceConfig<TState, TSliceReducers>,
  actions: Actions<TState, TSliceReducers>
): Slice<TState, Actions<TState, TSliceReducers>> => {
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
