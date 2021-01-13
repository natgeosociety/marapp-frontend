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

import createAuth0Client, { Auth0Client } from '@auth0/auth0-spa-js';
import auth0 from 'config/auth0';
import get from 'lodash/get';
import qs from 'query-string';
import React, { useContext, useEffect, useState } from 'react';
import { routeToPage } from 'utils';

import {
  getPrivateGroups,
  getPublicGroups,
  hasAccess,
  isAuthz,
  mapAuthzScopes,
  mapRoleGroups,
  SessionStorage,
} from '@marapp/earth-shared';

import { Auth0 } from './model';

// Auth0 will enforce namespacing when performing OIDC-conformant
// login flows, meaning that any custom claims without HTTP/HTTPS
// namespaces will be silently excluded from tokens.
const NAMESPACE = auth0.config.namespace;

export const Auth0Context = React.createContext<Auth0>(null);
export const useAuth0 = () => useContext(Auth0Context);

interface Auth0ProviderOptions {
  domain?: any;
  client_id?: any;
  redirect_uri?: any;
  audience?: any;
  children: React.ReactElement;
  useRefreshTokens?: boolean;
  cacheLocation?: 'memory' | 'localstorage';
  onRedirectCallback(targetUrl: any): void;
  onSuccessHook(params: any): void;
  onFailureHook(params: any): void;
}

interface IQueryParams {
  org?: string;
  error?: string;
  code?: string;
}

export const Auth0Provider = ({
  children,
  onRedirectCallback,
  onSuccessHook,
  onFailureHook,
  ...initOptions
}: Auth0ProviderOptions & Auth0Client) => {
  const [client, setClient] = useState<any>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [email, setEmail] = useState('');
  const [userData, setUserData] = useState({});

  const [groups, setGroups] = useState([]);
  const [publicGroups, setPublicGroups] = useState([]);
  const [privateGroups, setPrivateGroups] = useState([]);
  const [roles, setRoles] = useState({});
  const [permissions, setPermissions] = useState({});
  // TODO: rename this to selectedGroups
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(initOptions as any);
      const queryParams: IQueryParams = qs.parse(window.location.search);
      setClient(auth0FromHook);

      if (queryParams.code) {
        try {
          const { appState } = await auth0FromHook.handleRedirectCallback();
          onRedirectCallback({ targetUrl: appState.targetUrl });
        } catch (e) {
          // since we don't support IdP-Initiated Single Sign-On,
          // redirect to root page;
          // @ts-ignore
          routeToPage({});
        }
      }

      if (queryParams.error) {
        onFailureHook(queryParams);
      }

      const isAuthenticated = await auth0FromHook.isAuthenticated();
      setIsAuthenticated(isAuthenticated);

      const accessToken = isAuthenticated ? await auth0FromHook.getTokenSilently() : null;
      onSuccessHook({ accessToken, authClient: auth0FromHook });

      const idToken = accessToken ? await auth0FromHook.getUser() : {};

      const roles = get(idToken, `${NAMESPACE}/roles`, []);
      const mappedRoles = mapAuthzScopes(roles);
      setRoles(mappedRoles);

      setPrivateGroups(getPrivateGroups(mappedRoles));
      setPublicGroups(getPublicGroups(mappedRoles));

      const groups = get(idToken, `${NAMESPACE}/groups`);
      const roleGroups = mapRoleGroups(roles, ['*']); // exclude special groups;
      setGroups(roleGroups);

      const permissions = get(idToken, `${NAMESPACE}/permissions`, []);
      setPermissions(mapAuthzScopes(permissions));

      const emailVerified = get(idToken, 'email_verified', false);
      setIsEmailVerified(emailVerified);

      const authorized = isAuthz(roles);
      setIsAuthorized(authorized);

      const givenName = get(idToken, 'given_name', '');
      const familyName = get(idToken, 'family_name', '');

      const userData = {
        email: get(idToken, 'email', ''),
        name:
          givenName || familyName ? `${givenName} ${familyName}`.trim() : get(idToken, 'name', ''),
        picture: get(idToken, 'picture', ''),
        allGroups: roleGroups,
        roles: mappedRoles,
      };
      setUserData(userData);
      setEmail(userData.email);

      const { user } = SessionStorage.getObject('ephemeral');

      // only select orgs that are available in the token
      const selected =
        user && user.group ? roleGroups.filter((g) => user.group.includes(g)) : roleGroups;

      // if no orgs remain in the list, apply all the orgs from the token
      setSelectedGroup(selected.length ? selected : roleGroups);

      setIsLoading(false);
    };
    initAuth0();
  }, []); // eslint-disable-line

  /**
   * Logging-in will automatically request the offline_access scope and store the resulting
   * refresh token.
   * @param options
   */
  const login = (options = {}) => {
    SessionStorage.remove('ephemeral');

    return client.loginWithRedirect(options);
  };

  const logout = (options = {}) => {
    SessionStorage.remove('ephemeral');

    // force the user to log out of their identity provider;
    return client.logout({ ...options, federated: true });
  };

  /**
   * Silently refreshing the access token will use the /token endpoint with ‘refresh_token’
   * grant and the refresh token from the cache.
   * @param options
   */
  const getAccessToken = (options = {}): Promise<string> => {
    return client.getTokenSilently(options);
  };

  const getUser = (options = {}) => {
    return client.getUser(options);
  };

  const updateToken = async () => {
    const accessToken = isAuthenticated ? await getAccessToken({ ignoreCache: true }) : null;

    onSuccessHook({ accessToken });
  };

  const getPermissions = (type: string[], org: string) => {
    return hasAccess(permissions[org], type) || hasAccess(permissions['*'], type);
  };

  return (
    <Auth0Context.Provider
      value={{
        isLoading,
        isAuthenticated,
        isAuthorized,
        isEmailVerified,
        email,
        userData,
        groups,
        publicGroups,
        privateGroups,
        roles,
        permissions,
        selectedGroup,
        login,
        logout,
        getUser,
        getAccessToken,
        updateToken,
        getPermissions,
        setupUserOrg: setSelectedGroup,
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};
