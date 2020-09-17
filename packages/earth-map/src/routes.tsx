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

import { User } from 'auth/model';
import { BASE_URL, ENABLE_PUBLIC_ACCESS } from 'config';
import qs from 'query-string';
import { NOT_FOUND } from 'redux-first-router';
import restoreScroll from 'redux-first-router-restore-scroll';

const UNAUTHORIZED_PAGE = 'UNAUTHORIZED';
const VERIFY_EMAIL = 'VERIFY_EMAIL';

/**
 * Authenticated resolver.
 * @param user
 */
const isAuthenticatedRequired = (user: User = {}): boolean => {
  return !ENABLE_PUBLIC_ACCESS;
};

/**
 * Authorized resolver.
 * @param user
 */
const isAuthorizedRequired = (user: User = {}): boolean => {
  if (!user.emailVerified) {
    return true;
  }
  return !ENABLE_PUBLIC_ACCESS;
};

/**
 * Fallback route resolver.
 * @param user
 */
const fallbackRouteResolver = (user: User): string => {
  if (user && !user?.emailVerified) {
    return VERIFY_EMAIL;
  }
  if (!ENABLE_PUBLIC_ACCESS) {
    return UNAUTHORIZED_PAGE;
  }
  return null;
};

export const ROUTES = {
  HOME: {
    path: '/',
    page: 'home',
    isAuthenticated: isAuthenticatedRequired,
    isAuthorized: isAuthorizedRequired,
    fallbackRoute: fallbackRouteResolver,
  },
  EARTH: {
    path: '/earth',
    page: 'earth',
    isAuthenticated: isAuthenticatedRequired,
    isAuthorized: isAuthorizedRequired,
    fallbackRoute: fallbackRouteResolver,
  },
  LOCATION: {
    path: '/earth/:organization/:slug',
    page: 'earth',
    isAuthenticated: isAuthenticatedRequired,
    isAuthorized: isAuthorizedRequired,
    fallbackRoute: fallbackRouteResolver,
  },
  CHANGE_EMAIL: {
    path: '/profile/change-email',
    page: 'change-email',
    isAuthenticated: () => true,
    isAuthorized: () => false,
    fallbackRoute: () => null,
  },
  ERROR: {
    path: '/error',
    page: 'error',
    isAuthenticated: () => false,
    isAuthorized: () => false,
    fallbackRoute: () => null,
  },
  [NOT_FOUND]: {
    path: '/404',
    page: 'not-found',
    isAuthenticated: () => false,
    isAuthorized: () => false,
    fallbackRoute: () => null,
  },
  [VERIFY_EMAIL]: {
    path: '/verify-email',
    page: 'verify-email',
    isAuthenticated: () => false,
    isAuthorized: () => false,
    fallbackRoute: () => null,
  },
  [UNAUTHORIZED_PAGE]: {
    path: '/unauthorized',
    page: 'unauthorized',
    isAuthenticated: () => true,
    isAuthorized: () => false,
    fallbackRoute: () => null,
  },
};

export const CONFIG = {
  basename: BASE_URL,
  location: 'router',
  querySerializer: {
    stringify: qs.stringify,
    parse: (url) => {
      return qs.parse(url, {
        arrayFormat: 'comma',
        parseNumbers: true,
        parseBooleans: true,
      });
    },
  },
  initialDispatch: false,
  restoreScroll: restoreScroll({
    shouldUpdateScroll: (prev, current) => {
      if (
        ((current.kind === 'redirect' && prev.kind === 'push') ||
          (current.kind === 'pop' && prev.kind === 'pop')) &&
        prev.pathname === current.pathname
      ) {
        return prev.prev.pathname !== current.pathname ? [0, 0] : false;
      }
      return prev.pathname !== current.pathname ? [0, 0] : false;
    },
  }),
};

export default {
  ROUTES,
  CONFIG,
};
