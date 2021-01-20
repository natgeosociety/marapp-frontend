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

import createAuth0Client, {
  Auth0Client,
  GetTokenSilentlyOptions,
  GetUserOptions,
} from '@auth0/auth0-spa-js';
import jwt from 'jsonwebtoken';
import get from 'lodash/get';
import qs from 'query-string';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import {
  hasAccess,
  isAdminAuthz,
  mapAuthorizedRoleGroups,
  mapAuthzScopes,
} from '@marapp/earth-shared';

import { ADMIN_AUTH0_NAMESPACE } from '@app/config';
import { routeToPage } from '@app/utils';
import { Auth0Context } from '@app/utils/contexts';

// Auth0 will enforce namespacing when performing OIDC-conformant
// login flows, meaning that any custom claims without HTTP/HTTPS
// namespaces will be silently excluded from tokens.
const NAMESPACE = ADMIN_AUTH0_NAMESPACE;

export const useAuth0: any = () => useContext(Auth0Context);

interface Auth0ProviderOptions {
  domain?: any;
  client_id?: any;
  redirect_uri?: any;
  audience?: any;
  children: React.ReactElement;
  useRefreshTokens?: boolean;
  cacheLocation?: 'memory' | 'localstorage';
  onRedirectCallback(targetUrl: string): void;
  onSuccessHook(params: any): void;
  onFailureHook(params: any): void;
}

interface IQueryParams {
  org?: string;
  error?: string;
  code?: string;
}

/**
 * Root level component
 * Provides important app lifecycle steps in the order below:
 *  - isAuthenticated/isAuthorized/groups
 *  - isAppBootstrapped - set after previous step is complete. Used by <ProtectedRoute /> to only render it's children after isAppBootstrapped=true
 *  - isLoading - final flag set by <Organization /> component after it checkes the /ORG param inside the url
 */
export const Auth0Provider = ({
  children,
  onRedirectCallback,
  onSuccessHook,
  onFailureHook,
  ...initOptions
}: Auth0ProviderOptions & Auth0Client) => {
  const [client, setClient] = useState<Auth0Client>({} as any);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isAppBootstrapped, setIsAppBootstrapped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [groups, setGroups] = useState([]);
  const [roles, setRoles] = useState({});
  const [permissions, setPermissions] = useState({});
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [userData, setUserData] = useState({});

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(initOptions as any);
      const queryParams: IQueryParams = qs.parse(window.location.search);
      setClient(auth0FromHook);

      if (queryParams.code) {
        try {
          const { appState } = await auth0FromHook.handleRedirectCallback();
          onRedirectCallback(appState.targetUrl);
        } catch (e) {
          // since we don't support IdP-Initiated Single Sign-On,
          // redirect to root page;
          routeToPage('/');
        }
      }

      if (queryParams.error) {
        onFailureHook(queryParams);
      }

      const isAuthenticated = await auth0FromHook.isAuthenticated();
      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const accessToken = await auth0FromHook.getTokenSilently();
        const idToken = await auth0FromHook.getUser();

        setAccessTokenContext(accessToken);
        setIdTokenContext(idToken);

        onSuccessHook({ accessToken, authClient: auth0FromHook });
      }

      // needed for the <Org/> to render and check if org is valid
      setIsAppBootstrapped(true);
    };
    initAuth0();
  }, []); // eslint-disable-line

  /**
   * Logging-in will automatically request the offline_access scope and store the resulting
   * refresh token.
   * @param options
   */
  const login = useCallback(
    (options = {}) => {
      return client.loginWithRedirect && client.loginWithRedirect(options);
    },
    [client]
  );

  const logout = useCallback(
    (options?: {}) => {
      // force the user to log out of their identity provider;
      return client.logout && client.logout({ ...options, federated: true });
    },
    [client]
  );

  /**
   * Silently refreshing the access token will use the /token endpoint with ‘refresh_token’
   * grant and the refresh token from the cache.
   * @param options
   */
  const getAccessToken = useCallback(
    (options: GetTokenSilentlyOptions = {} as any) => {
      return client.getTokenSilently && client.getTokenSilently(options);
    },
    [client]
  );

  const getUser = useCallback(
    (options: GetUserOptions = {} as any) => {
      return client.getUser && client.getUser(options);
    },
    [client]
  );

  const setAccessTokenContext = (accessToken: string) => {
    const decoded = jwt.decode(accessToken);

    const rawGroups = get(decoded, `${NAMESPACE}/groups`);
    const rawRoles = get(decoded, `${NAMESPACE}/roles`, []);
    const rawPermissions = get(decoded, `${NAMESPACE}/permissions`, []);

    // special case where no groups and only super-admin role assigned;
    const roleGroups = mapAuthorizedRoleGroups(rawRoles, ['*']).length
      ? mapAuthorizedRoleGroups(rawRoles, ['*'])
      : mapAuthorizedRoleGroups(rawRoles);
    setGroups(roleGroups);

    const roles = mapAuthzScopes(rawRoles);
    setRoles(roles);

    const permissions = mapAuthzScopes(rawPermissions);
    setPermissions(permissions);

    const authorized = isAdminAuthz(rawRoles);
    setIsAuthorized(authorized);

    const [selected] = roleGroups;
    setSelectedGroup(selected);
  };

  const setIdTokenContext = (idToken: { [key: string]: any }) => {
    const givenName = get(idToken, 'given_name', '');
    const familyName = get(idToken, 'family_name', '');

    const userData = {
      email: get(idToken, 'email', ''),
      name:
        givenName || familyName ? `${givenName} ${familyName}`.trim() : get(idToken, 'name', ''),
      picture: get(idToken, 'picture', ''),
    };
    setUserData(userData);
  };

  const updateToken = useCallback(async () => {
    if (isAuthenticated) {
      const accessToken = await getAccessToken({ ignoreCache: true });
      setAccessTokenContext(accessToken);

      onSuccessHook({ accessToken, authClient: client });
    }
  }, [isAuthenticated]);

  const getPermissions = (type: string[]) => {
    return hasAccess(permissions[selectedGroup], type) || hasAccess(permissions['*'], type);
  };

  return (
    <Auth0Context.Provider
      value={{
        isLoading,
        isAuthenticated,
        isAuthorized,
        isAppBootstrapped,
        groups,
        roles,
        permissions,
        selectedGroup,
        login,
        logout,
        userData,
        getUser,
        getAccessToken,
        setIsLoading,
        setupUserOrg: setSelectedGroup,
        getPermissions,
        updateToken,
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};
