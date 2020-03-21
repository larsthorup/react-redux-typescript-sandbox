import { signin, signout } from '../store/auth';
import { historyReplace } from '../lib/redux-history';
import { Saga } from '../store';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const signingIn = (username: string): Saga => async dispatch => {
  await wait(500); // Note: simulating slow fetch
  dispatch(signin({ user: { name: username } }));
  dispatch(historyReplace({ pathname: '/' }));
};

export const signingOut = (): Saga => async dispatch => {
  dispatch(signout());
  dispatch(historyReplace({ pathname: '/' }));
};
