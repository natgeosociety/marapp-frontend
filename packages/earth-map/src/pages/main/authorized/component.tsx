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

import React from 'react';
import { useEffect } from 'react';

import { useAuth0 } from 'auth/auth0';
import AsyncPage from 'pages/main/async';

const AuthorizedPage = ({ component: Component, fallbackRoute, redirect, ...rest }) => {
  const { isAuthenticated, isAuthorized, login } = useAuth0();

  useEffect(() => {
    const fn = async () => {
      if (!isAuthenticated) {
        // preserve path, query and hash params when redirecting;
        const target = window.location.href.replace(window.location.origin, '')
        // save target URL to redirect to after login;
        await login({ appState: { targetUrl: target } });
      } else if (!isAuthorized) {
        redirect({ type: fallbackRoute });
      }
    };
    fn();
  });

  if (isAuthenticated && isAuthorized) {
    const render = props => <Component {...props} />;

    return <AsyncPage render={render} {...rest} />;
  }

  return null;
};

export default AuthorizedPage;
