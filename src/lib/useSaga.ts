import { Saga } from '../store';
import { useState } from 'react';

const useSaga = <T>(
  saga: Saga<T>
): [Saga<T>, { error: Error | null; isRunning: boolean }] => {
  const [error, setError] = useState(null as Error | null);
  const [isRunning, setIsRunning] = useState(false);
  const instrumentedSaga: Saga<T> = (arg: T) => async (
    dispatch,
    getState,
    extra
  ) => {
    setIsRunning(true);
    try {
      setError(null);
      await saga(arg)(dispatch, getState, extra);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsRunning(false);
    }
  };
  return [instrumentedSaga, { error, isRunning }];
};

export default useSaga;
