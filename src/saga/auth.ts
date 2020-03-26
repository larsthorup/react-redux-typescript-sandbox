import auth from '../store/auth';
import { historyReplace } from '../lib/redux-history';
import { Saga } from '../store';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const signingIn = (username: string): Saga => async dispatch => {
  await wait(500); // Note: simulating slow fetch
  dispatch(auth.actions.signin({ user: { name: username } }));
  dispatch(historyReplace({ pathname: '/' }));
};

export const signingOut = (): Saga => async dispatch => {
  dispatch(auth.actions.signout());
  dispatch(historyReplace({ pathname: '/' }));
};
