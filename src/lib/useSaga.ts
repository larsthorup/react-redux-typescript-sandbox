import { useState } from 'react';

import { Saga } from './redux-saga';

// Note: based loosely on https://react-query.tanstack.com/docs/api#usemutation

const useSaga = <TState, TArg, TResult>(
  saga: Saga<TState, TArg, TResult>,
  options?: { throwOnError?: boolean }
): [
  Saga<TState, TArg, TResult | undefined>,
  {
    data: TResult | undefined;
    error: Error | null;
    isRunning: boolean;
    isCompleted: boolean;
  }
] => {
  const [data, setData] = useState(undefined as TResult | undefined);
  const [error, setError] = useState(null as Error | null);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const instrumentedSaga: Saga<TState, TArg, TResult | undefined> = (
    arg: TArg
  ) => async (dispatch, getState, extra) => {
    setIsRunning(true);
    setIsCompleted(false);
    try {
      setError(null);
      const data = await saga(arg)(dispatch, getState, extra);
      setData(data);
      setIsCompleted(true);
      return data;
    } catch (err) {
      setError(err);
      if (options?.throwOnError) throw err;
    } finally {
      setIsRunning(false);
    }
  };
  return [instrumentedSaga, { data, error, isRunning, isCompleted }];
};

export default useSaga;
