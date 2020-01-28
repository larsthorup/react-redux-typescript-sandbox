import queryString from 'query-string';
import * as R from 'ramda';
import { Middleware, Store } from 'redux';
import * as History from 'history';
import { createActionCreator, AnyAction, isType } from './redux-action';

export const history = History.createBrowserHistory();

export type State = Readonly<{
  hash?: queryString.ParsedQuery<string>;
  pathname: string;
  search?: queryString.ParsedQuery<string>;
}>;

function stringify(state: State): History.Location {
  return {
    hash: queryString.stringify(state.hash || {}),
    pathname: state.pathname,
    search: queryString.stringify(state.search || {}),
    state: null
  };
}

const historyChange = createActionCreator<History.Location>('historyChange'); // Note: for internal use only
export const historyPush = createActionCreator<State>('historyPush');
export const historyReplace = createActionCreator<State>('historyReplace');

export const initialState: State = {
  hash: {},
  pathname: '/',
  search: {}
};

export function reducer(state: State = initialState, action: AnyAction): State {
  if (isType(action, historyChange)) {
    const location = {
      hash: queryString.parse(action.payload.hash),
      pathname: action.payload.pathname,
      search: queryString.parse(action.payload.search)
    };
    const unchanged = R.equals(state, location);
    if (unchanged) {
      return state;
    } else {
      return {
        hash: location.hash || state.hash,
        pathname: location.pathname || state.pathname,
        search: location.search || state.search
      };
    }
  } else {
    return state;
  }
}

export function createMiddleware(slicer: Slicer): Middleware {
  return store => next => (action: AnyAction) => {
    const state = slicer(store.getState());
    if (isType(action, historyPush)) {
      const { payload } = action;
      if (!R.equals(state, payload)) {
        history.push(stringify(payload));
      }
    } else if (isType(action, historyReplace)) {
      const { payload } = action;
      if (!R.equals(state, payload)) {
        history.replace(stringify(payload));
      }
    } else {
      next(action);
    }
  };
}

export interface Listener {
  unlisten: () => void;
}
export function listen(store: Store): Listener {
  const unlisten = history.listen((location: History.Location, _) => {
    store.dispatch(historyChange(location));
  });
  const { location } = history;
  store.dispatch(historyChange(location)); // Note: initial location
  return { unlisten };
}

export type Slicer = (state: any) => State;
