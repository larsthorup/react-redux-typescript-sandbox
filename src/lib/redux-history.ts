import queryString from 'query-string';
import * as R from 'ramda';
import { Middleware, Store } from 'redux';
import * as History from 'history';
import { createActionCreator, AnyAction, isType } from './redux-action';

export const history = History.createBrowserHistory();

export type State = Readonly<{
  hash: queryString.ParsedQuery<string>;
  pathname: string;
  search: queryString.ParsedQuery<string>;
}>;

export type Props = Readonly<{
  hash?: queryString.ParsedQuery<string>;
  pathname: string;
  search?: queryString.ParsedQuery<string>;
}>;

const stringify = (state: State): History.Location => ({
  hash: queryString.stringify(state.hash || {}),
  pathname: state.pathname,
  search: queryString.stringify(state.search || {}),
  state: null
});

const stringifyProps = (props: Props): History.Location =>
  stringify({
    hash: props.hash || {},
    pathname: props.pathname,
    search: props.search || {}
  });

const locationChanged = createActionCreator<History.Location>(
  'locationChanged'
); // Note: for internal use only
export const historyPush = createActionCreator<Props>('historyPush');
export const historyReplace = createActionCreator<Props>('historyReplace');

export const initialState: State = {
  hash: {},
  pathname: '/',
  search: {}
};

export const reducer = (
  state: State = initialState,
  action: AnyAction
): State => {
  if (isType(action, locationChanged)) {
    const location = {
      hash: queryString.parse(action.payload.hash) || {},
      pathname: action.payload.pathname,
      search: queryString.parse(action.payload.search) || {}
    };
    return R.equals(state, location) ? state : location;
  } else {
    return state;
  }
};

export const createMiddleware = (
  slicer: Slicer
): Middleware => store => next => (action: AnyAction) => {
  const state = slicer(store.getState());
  if (isType(action, historyPush)) {
    const { payload } = action;
    if (!R.equals(state, payload)) {
      history.push(stringifyProps(payload));
    }
  } else if (isType(action, historyReplace)) {
    const { payload } = action;
    if (!R.equals(state, payload)) {
      history.replace(stringifyProps(payload));
    }
  } else {
    next(action);
  }
};

export interface Listener {
  unlisten: () => void;
}
export const listen = (store: Store): Listener => {
  const unlisten = history.listen((location: History.Location, _) => {
    store.dispatch(locationChanged(location));
  });
  const { location } = history;
  store.dispatch(locationChanged(location)); // Note: initial location
  return { unlisten };
};

export type Slicer = (state: any) => State;
