import React, { useContext } from 'react';
import { Provider } from 'react-redux';
import initStore from './store';

import Main from './pages/main';
import { Auth0Context, useAuth0 } from './auth/auth0';
import { Spinner } from '@marapp/earth-components';

const App = () => {
  const { isLoading } = useAuth0();
  const { selectedGroup } = useContext(Auth0Context);

  const initialState = {
    user: {
      group: selectedGroup
    },
  };


  if (!isLoading) {
    // TODO: move initStore outside of render
    const { store } = initStore(initialState);

    return (
      // @ts-ignore
      <Provider store={store}>
        <Main />
      </Provider>
    );
  }

  return (
    <Spinner size="large" />
  );
};

export default App;
