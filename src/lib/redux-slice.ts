import * as R from 'ramda';
import { AnyAction } from './redux-action';

type SliceConfig<TState> = {
  name: string;
  initialState: TState;
  reducers: { [key: string]: (state: TState, action: any) => TState };
};

export const createSlice = <TState, TActions>(
  sliceConfig: SliceConfig<TState>,
  actions: TActions
) => {
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
