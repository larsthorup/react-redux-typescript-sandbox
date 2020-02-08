import { useSelector, useDispatch } from 'react-redux';
import { Slicer, historyReplace, historyPush } from './redux-history';
import { ReactElement } from 'react';

export type Routes = { [key: string]: ReactElement };

export function useNavigate() {
  const dispatch = useDispatch();
  return (pathname: string, hash = {}, { replace } = { replace: false }) => (
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    const actionCreator = replace ? historyReplace : historyPush;
    dispatch(actionCreator({ hash, pathname }));
  };
}

export function useRoutes(routes: Routes, slicer: Slicer) {
  const pathname = useSelector(state => slicer(state).pathname);
  return routes[pathname];
}
