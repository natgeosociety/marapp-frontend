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

import React, { useState, useEffect, useContext, useCallback } from 'react';
import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import qs from 'query-string';
import get from 'lodash/get';

import { routeToPage, removeNestedGroups, mapAuthzScopes, hasAccess } from 'utils';
import { Auth0Context } from 'utils/contexts';
import { GATSBY_APP_AUTH0_NAMESPACE } from 'config';

// Auth0 will enforce namespacing when performing OIDC-conformant
// login flows, meaning that any custom claims without HTTP/HTTPS
// namespaces will be silently excluded from tokens.
const NAMESPACE = GATSBY_APP_AUTH0_NAMESPACE;

export const useAuth0: any = () => useContext(Auth0Context);

interface Auth0ProviderOptions {
  children: React.ReactElement;

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
  const [userData, setUserData] = useState({});

  const [groups, setGroups] = useState([]);
  const [roles, setRoles] = useState({});
  const [permissions, setPermissions] = useState({});
  const [selectedGroup, setSelectedGroup] = useState(null);

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
        onSuccessHook({ token: accessToken });

        const idToken = await auth0FromHook.getUser();

        const roles = get(idToken, `${NAMESPACE}/roles`, []);
        setRoles(mapAuthzScopes(roles));

        const isSuperAdmin = roles.find(role => role === '*:SuperAdmin');

        const groups = get(idToken, `${NAMESPACE}/groups`, []);
        const [defaultGroup] = groups;
        const nonNestedGroups = removeNestedGroups(groups);
        setGroups(isSuperAdmin ? ['*', ...nonNestedGroups] : nonNestedGroups);

        const permissions = get(idToken, `${NAMESPACE}/permissions`, []);

        setPermissions(mapAuthzScopes(permissions));

        const email = get(idToken, 'email', '');
        const userName = get(idToken, 'name', '');
        const userPicture = get(idToken, 'picture', '');

        setUserData({ name: userName, picture: userPicture, allGroups: nonNestedGroups });

        const authorized = !!roles.length;
        setIsAuthorized(authorized);

        // Default group only used on <Homepage />
        // will be overwritten by <Org /> with org comming from URL
        if (!selectedGroup) {
          setSelectedGroup((isSuperAdmin && !defaultGroup) ? '*' : defaultGroup);
        }
      }

      // needed for the <Org/> to render and check if org is valid
      setIsAppBootstrapped(true);
    };
    initAuth0();
  }, []); // eslint-disable-line

  const login = useCallback((options = {}) => {
    return client.loginWithRedirect && client.loginWithRedirect(options);
  }, [client]);

  const logout = useCallback((options?: {}) => {
    // force the user to log out of their identity provider;
    return client.logout && client.logout({ ...options, federated: true });
  }, [client]);

  const getUser = useCallback((options: GetUserOptions = {} as any) => {
    return client.getUser && client.getUser(options);
  }, [client]);

  const getToken = useCallback((options: GetTokenSilentlyOptions = {} as any) => {
    return client.getTokenSilently && client.getTokenSilently(options);
  }, [client]);

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
        getToken,
        setIsLoading,
        setupUserOrg: setSelectedGroup,
        getPermissions,
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};
