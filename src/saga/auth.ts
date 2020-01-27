import { Dispatch } from 'redux';
import { signin } from '../store/auth';

export function signingIn(username: string, password: string) {
  return async function(dispatch: Dispatch) {
    setTimeout(() => {
      const response = { user: { name: username } };
      dispatch(signin(response));
    }, 500); // Note: simulating slow fetch
  };
}
