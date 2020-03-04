import { useSelector, useDispatch } from 'react-redux';
import { Slicer, historyReplace, historyPush } from './redux-history';
import { ReactNode } from 'react';

export type Routes = { [key: string]: ReactNode };

export function useNavigate({ replace } = { replace: false }) {
  const dispatch = useDispatch();
  return (pathname: string, hash = {}) => (e: React.MouseEvent) => {
    e.preventDefault();
    const actionCreator = replace ? historyReplace : historyPush;
    dispatch(actionCreator({ hash, pathname }));
  };
}

export function useRoutes(routes: Routes, slicer: Slicer) {
  const pathname = useSelector(state => slicer(state).pathname);
  return routes[pathname];
}
