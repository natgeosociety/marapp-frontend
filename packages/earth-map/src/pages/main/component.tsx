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

import { useAuth0 } from 'auth/auth0';
import React from 'react';

import AsyncPage from './async';
import AuthenticatedPage from './authenticated';
import AuthorizedPage from './authorized';
import { ADMIN_URL } from 'config';
import { isSuperAdmin } from '@marapp/earth-shared';

const Main = ({ router }) => {
  const { isAuthenticated, isEmailVerified, userData } = useAuth0();
  const { type, routesMap } = router;
  const { page, isAuthRequired, isAuthzRequired, fallbackRouteResolver } = routesMap[type];
  const context = { isEmailVerified };

  if (userData.allGroups.length === 0 && isSuperAdmin(userData.roles)) {
    window.location.assign(ADMIN_URL);
  }

  let Page;
  switch (true) {
    case isAuthRequired && isAuthRequired(context) && isAuthzRequired(context):
      Page = AuthorizedPage;
      break;
    case (isAuthRequired && isAuthRequired(context)) || (isAuthenticated && !isEmailVerified):
      Page = AuthenticatedPage;
      break;
    default:
      Page = AsyncPage;
  }

  return (
    <React.Fragment>
      {page === 'home' && (
        // @ts-ignore
        <Page page="home" fallbackRoute={fallbackRouteResolver(context)} />
      )}
      {page === 'earth' && (
        // @ts-ignore
        <Page page="earth" fallbackRoute={fallbackRouteResolver(context)} />
      )}
      {page === 'experience' && (
        // @ts-ignore
        <Page page="experience" fallbackRoute={fallbackRouteResolver(context)} />
      )}
      {page === 'change-email' && (
        // @ts-ignore
        <Page page="change-email" fallbackRoute={fallbackRouteResolver(context)} />
      )}
      {page === 'profile' && (
        // @ts-ignore
        <Page page="profile" fallbackRoute={fallbackRouteResolver(context)} />
      )}
      {page === 'not-found' && (
        // @ts-ignore
        <Page page="not-found" fallbackRoute={fallbackRouteResolver(context)} />
      )}
      {page === 'error' && (
        // @ts-ignore
        <Page page="error" fallbackRoute={fallbackRouteResolver(context)} />
      )}
      {page === 'unauthorized' && (
        // @ts-ignore
        <Page page="unauthorized" fallbackRoute={fallbackRouteResolver(context)} />
      )}
      {page === 'verify-email' && (
        // @ts-ignore
        <Page page="verify-email" />
      )}
    </React.Fragment>
  );
};

export default Main;
