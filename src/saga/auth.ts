import { signin, signout } from '../store/auth';
import { historyReplace } from '../lib/redux-history';
import { Saga } from '../store';

export function signingIn(username: string, password: string): Saga {
  return async function(dispatch) {
    return new Promise(resolve => {
      setTimeout(() => {
        dispatch(signin({ user: { name: username } }));
        dispatch(historyReplace({ pathname: '/' }));
        resolve();
      }, 500); // Note: simulating slow fetch
    });
  };
}

export function signingOut(): Saga {
  return async function(dispatch) {
    dispatch(signout());
    dispatch(historyReplace({ pathname: '/' }));
  };
}
