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

import { BASE_URL, ENABLE_PUBLIC_ACCESS } from 'config';
import { noop, stubFalse, stubTrue } from 'lodash';
import qs from 'query-string';
import { NOT_FOUND } from 'redux-first-router';
import restoreScroll from 'redux-first-router-restore-scroll';

const UNAUTHORIZED_PAGE = 'UNAUTHORIZED';
const VERIFY_EMAIL = 'VERIFY_EMAIL';

/**
 * Authenticated resolver.
 * @param context
 */
const isAuthRequired = (context: any = {}): boolean => {
  return !ENABLE_PUBLIC_ACCESS;
};

/**
 * Authorized resolver.
 * @param context
 */
const isAuthzRequired = (context: any = {}): boolean => {
  return !ENABLE_PUBLIC_ACCESS;
};

/**
 * Fallback route resolver.
 * @param context
 */
const fallbackRouteResolver = (context: any = {}): string => {
  switch (true) {
    case !context.isEmailVerified:
      return VERIFY_EMAIL;
    case !ENABLE_PUBLIC_ACCESS:
      return UNAUTHORIZED_PAGE;
    default:
      return null;
  }
};

export const ROUTES = {
  HOME: {
    path: '/',
    page: 'home',
    isAuthRequired,
    isAuthzRequired,
    fallbackRouteResolver,
  },
  EARTH: {
    path: '/earth',
    page: 'earth',
    isAuthRequired,
    isAuthzRequired,
    fallbackRouteResolver,
  },
  LOCATION: {
    path: '/earth/:organization/:slug',
    page: 'earth',
    isAuthRequired,
    isAuthzRequired,
    fallbackRouteResolver,
  },
  CHANGE_EMAIL: {
    path: '/profile/change-email',
    page: 'change-email',
    isAuthRequired: stubTrue,
    isAuthzRequired: stubFalse,
    fallbackRouteResolver: noop,
  },
  PROFILE: {
    path: '/profile',
    page: 'profile',
    authenticated: true,
    authorized: false,
    fallbackRoute: null,
  },
  ERROR: {
    path: '/error',
    page: 'error',
    isAuthRequired: stubFalse,
    isAuthzRequired: stubFalse,
    fallbackRouteResolver: noop,
  },
  [NOT_FOUND]: {
    path: '/404',
    page: 'not-found',
    isAuthRequired: stubFalse,
    isAuthzRequired: stubFalse,
    fallbackRouteResolver: noop,
  },
  [VERIFY_EMAIL]: {
    path: '/verify-email',
    page: 'verify-email',
    isAuthRequired: stubFalse,
    isAuthzRequired: stubFalse,
    fallbackRouteResolver: noop,
  },
  [UNAUTHORIZED_PAGE]: {
    path: '/unauthorized',
    page: 'unauthorized',
    isAuthRequired: stubTrue,
    isAuthzRequired: stubFalse,
    fallbackRouteResolver: noop,
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
