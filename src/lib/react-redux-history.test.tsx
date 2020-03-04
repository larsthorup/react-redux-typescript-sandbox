import React, { ReactElement } from 'react';
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import { fireEvent, render, wait, getNodeText } from '@testing-library/react';

import * as ReduxHistory from './redux-history';
import * as ReactReduxHistory from './react-redux-history';

test('react-redux-history', async () => {
  // given initial setup
  const rootReducer = Redux.combineReducers({
    location: ReduxHistory.reducer
  });
  type RootState = ReturnType<typeof rootReducer>;
  const locationSlicer = (state: RootState) => state.location;
  const middleware = Redux.compose(
    Redux.applyMiddleware(ReduxHistory.createMiddleware(locationSlicer))
  );
  const store: Redux.Store = Redux.createStore(rootReducer, middleware);
  ReduxHistory.listen(store);
  const Home = () => {
    const navigate = ReactReduxHistory.useNavigate();
    return (
      <>
        <div>Home</div>
        <button onClick={navigate('/signin')}>Login</button>
        <button onClick={navigate('/profile/47', { tab: 'all' })}>
          Profile
        </button>
      </>
    );
  };
  const Signin = () => <div>Signin</div>;
  const RoutePaths = {
    Home: '/',
    Profile: '/profile/:id',
    Signin: '/signin'
  };
  const Profile = () => {
    const { id } = ReactReduxHistory.usePath(
      RoutePaths.Profile,
      locationSlicer
    ) as { id: string };
    const { tab } = ReactRedux.useSelector(
      (state: RootState) => state.location.hash
    );
    return (
      <div>
        Profile-{id}-{tab}
      </div>
    );
  };
  const routes: ReactReduxHistory.Routes = {
    [RoutePaths.Home]: <Home />,
    [RoutePaths.Profile]: <Profile />,
    [RoutePaths.Signin]: <Signin />
  };
  const App = () => {
    const routeResult = ReactReduxHistory.useRoutes(routes, locationSlicer);
    return <>{routeResult}</>;
  };
  const rootComponent: ReactElement = (
    <ReactRedux.Provider store={store}>
      <App />
    </ReactRedux.Provider>
  );
  const { container, getByText } = render(rootComponent);

  // then initially Home is rendered
  expect(getByText('Home')).toBeInTheDocument();

  // when navigating
  fireEvent.click(getByText('Login'));

  // then Signin is rendered
  await wait(() => getByText('Signin'));

  // when clicking browser back
  ReduxHistory.history.goBack();

  // then Home is rendered
  await wait(() => getByText('Home'));

  // when navigating with hash parameter
  fireEvent.click(getByText('Profile'));

  // then Profile is rendered with that parameter
  await wait(() => getByText('Profile-47-all'));

  // when navigating to non-existing page
  ReduxHistory.history.push('/notyet');

  // then nothing is rendered
  expect(getNodeText(container)).toEqual('');
});
