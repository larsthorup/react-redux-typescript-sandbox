import { useSelector, useDispatch } from 'react-redux';
import { Slicer, historyReplace, historyPush } from './redux-history';
import { ReactNode } from 'react';
import { match } from 'path-to-regexp';

export type Routes = { [key: string]: ReactNode };

export function useNavigate({ replace } = { replace: false }) {
  const dispatch = useDispatch();
  return (pathname: string, hash = {}) => (e: React.MouseEvent) => {
    e.preventDefault();
    const actionCreator = replace ? historyReplace : historyPush;
    dispatch(actionCreator({ hash, pathname }));
  };
}

function findMatchResult(routes: Routes, pathname: string) {
  for (const routePath of Object.keys(routes)) {
    const matchResult = match(routePath)(pathname);
    if (matchResult) {
      return routePath;
    }
  }
}

export function useRoutes(routes: Routes, slicer: Slicer): ReactNode | null {
  const pathname = useSelector(state => slicer(state).pathname);
  const routePath = findMatchResult(routes, pathname);
  return routePath ? routes[routePath] : null;
}

export function usePath(routePath: string, slicer: Slicer): {} {
  const pathname = useSelector(state => slicer(state).pathname);
  const matchResult = match(routePath)(pathname);
  return matchResult ? matchResult.params : {};
}
