import React from 'react';
import { useEffect } from 'react';

import { useAuth0 } from 'auth/auth0';
import AsyncPage from 'pages/main/async';

const AuthenticatedPage = ({ component: Component, ...rest }) => {
  const { isAuthenticated, login } = useAuth0();

  useEffect(() => {
    const fn = async () => {
      if (!isAuthenticated) {
        // Save target URL to redirect to after login;
        await login({ appState: { targetUrl: `${window.location.pathname}${window.location.search}` } });
      }
    };
    fn();
  }, [isAuthenticated, login]);

  if (isAuthenticated) {
    const render = props => <Component {...props} />;

    return <AsyncPage render={render} {...rest} />;
  }

  return null;
};

export default AuthenticatedPage;
