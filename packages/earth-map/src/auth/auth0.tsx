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
import { useState, useEffect, useContext } from 'react';
import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import qs from 'query-string';
import get from 'lodash/get';

import { routeToPage, removeNestedGroups, mapAuthzScopes } from 'utils';
import { Auth0 } from './model';
import config from './config';

// Auth0 will enforce namespacing when performing OIDC-conformant
// login flows, meaning that any custom claims without HTTP/HTTPS
// namespaces will be silently excluded from tokens.
const NAMESPACE = config.auth0.namespace;

export const Auth0Context = React.createContext<Auth0>(null);
export const useAuth0 = () => useContext(Auth0Context);

interface Auth0ProviderOptions {
  domain?: any;
  client_id?: any;
  redirect_uri?: any;
  audience?: any;
  children: React.ReactElement;

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
  const [email, setEmail] = useState('');
  const [userData, setUserData] = useState({});

  const [groups, setGroups] = useState([]);
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

      onSuccessHook({ token: accessToken });

      const idToken = accessToken ? await auth0FromHook.getUser() : {};

      const email = get(idToken, 'email', '');
      const userName = get(idToken, 'name', '');
      const userPicture = get(idToken, 'picture', '');

      const groups = get(idToken, `${NAMESPACE}/groups`, []);

      const nonNestedGroups = removeNestedGroups(groups);
      setGroups(nonNestedGroups);

      const roles = get(idToken, `${NAMESPACE}/roles`, []);
      setRoles(mapAuthzScopes(roles));

      const permissions = get(idToken, `${NAMESPACE}/permissions`, []);
      setPermissions(mapAuthzScopes(permissions));

      const authorized = !!roles && roles.length > 0;
      setIsAuthorized(authorized);

      setEmail(email);
      setUserData({ name: userName, picture: userPicture, allGroups: nonNestedGroups });

      const { user } = JSON.parse(sessionStorage.getItem('ephemeral')) || {};
      if (user) {
        setSelectedGroup(user.group);
      } else if (!selectedGroup) {
        setSelectedGroup(nonNestedGroups);
      }

      setIsLoading(false);
    };
    initAuth0();
  }, []); // eslint-disable-line

  const login = (options = {}) => {
    sessionStorage.removeItem('ephemeral');
    return client.loginWithRedirect(options);
  };

  const logout = (options = {}) => {
    sessionStorage.removeItem('ephemeral');
    // force the user to log out of their identity provider;
    return client.logout({ ...options, federated: true });
  };

  const getUser = (options = {}) => {
    return client.getUser(options);
  };

  const getToken = (options = {}) => {
    return client.getTokenSilently(options);
  };

  return (
    <Auth0Context.Provider
      value={{
        isLoading,
        isAuthenticated,
        isAuthorized,
        email,
        userData,
        groups,
        roles,
        permissions,
        selectedGroup,
        login,
        logout,
        getUser,
        getToken,
        setupUserOrg: setSelectedGroup,
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};
