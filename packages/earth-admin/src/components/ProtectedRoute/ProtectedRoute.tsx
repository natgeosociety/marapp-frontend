import React, { useEffect, FunctionComponent } from 'react';
import { navigate } from 'gatsby';

import { useAuth0 } from 'auth/auth0';
import { Spinner } from '@marapp/earth-components';

interface IProps {
  path: string;
  component: FunctionComponent<any>
  children?: any
}

/**
 * Checks if isAuthenticated and isAuthorized
 * IMPORTANT: Also waits for isAppBootstrapped before rendering props.component
 */
export function ProtectedRoute(props: IProps) {
  const { component: Component, ...otherProps } = props;
  const {
    isAuthenticated,
    isAppBootstrapped,
    isAuthorized,
    login,
    selectedGroup,
  } = useAuth0();

  useEffect(() => {
    const fn = async () => {
      if (!isAuthenticated) {
        // Save target URL to redirect to after login;
        await login({ appState: { targetUrl: window.location.pathname } });
      } else if (!isAuthorized) {
        await navigate('/unauthorized');
      }
    };

    isAppBootstrapped && fn();
  }, [isAuthenticated, login, isAppBootstrapped, isAuthorized, selectedGroup]);

  if (!isAppBootstrapped) return <Spinner size="medium" />

  if (isAuthenticated && isAuthorized) {
    return <Component {...otherProps} />
  }

  return (
    <Spinner size="medium" />
  );
}