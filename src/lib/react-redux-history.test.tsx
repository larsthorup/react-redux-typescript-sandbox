import React, { ReactElement } from 'react';
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import { fireEvent, render, wait } from '@testing-library/react';

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
      <React.Fragment>
        <div>Home</div>
        <button onClick={navigate('/signin')}>Login</button>
      </React.Fragment>
    );
  };
  const Signin = () => <div>Signin</div>;
  const routes: ReactReduxHistory.Routes = {
    '/': <Home />,
    '/signin': <Signin />
  };
  const App = () => {
    const routeResult = ReactReduxHistory.useRoutes(routes, locationSlicer);
    return routeResult;
  };
  const rootComponent: ReactElement = (
    <ReactRedux.Provider store={store}>
      <App />
    </ReactRedux.Provider>
  );
  const { getByText } = render(rootComponent);

  // then initially Home is rendered
  expect(getByText('Home')).toBeInTheDocument();

  // when navigating
  fireEvent.click(getByText('Login'));
  await wait(() => getByText('Signin'));

  // then Signin is rendered
  expect(getByText('Signin')).toBeInTheDocument();
});
