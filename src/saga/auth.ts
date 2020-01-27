import { Dispatch } from 'redux';
import { signin, signout } from '../store/auth';
import { historyReplace } from '../lib/redux-history';

export function signingIn(username: string, password: string) {
  return async function(dispatch: Dispatch) {
    return new Promise(resolve => {
      setTimeout(() => {
        dispatch(signin({ user: { name: username } }));
        dispatch(historyReplace({ pathname: '/' }));
        resolve();
      }, 500); // Note: simulating slow fetch
    });
  };
}

export function signingOut() {
  return async function(dispatch: Dispatch) {
    dispatch(signout());
    dispatch(historyReplace({ pathname: '/' }));
    return Promise.resolve();
  };
}
