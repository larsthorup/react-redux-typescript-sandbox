import { useSelector } from 'react-redux';
import { Slicer } from './redux-history';
import { ReactElement } from 'react';

export type Routes = { [key: string]: ReactElement };

export function useRoutes (routes: Routes, slicer: Slicer) {
  const pathname = useSelector(state => slicer(state).pathname);
  return routes[pathname];
}
