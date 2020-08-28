/*
  Copyright 2018-2020 National Geographic Society

  Use of this software does not constitute endorsement by National Geographic
  Society (NGS). The NGS name and NGS logo may not be used for any purpose without
  written permission from NGS.

  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at

      https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed
  under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
  CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

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

  if (!isAppBootstrapped) return <Spinner size="medium" />;

  if (isAuthenticated && isAuthorized) {
    return <Component {...otherProps} />
  }

  return (
    <Spinner size="medium" />
  );
}
