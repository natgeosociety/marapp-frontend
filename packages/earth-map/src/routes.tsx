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

import qs from 'query-string';
import { NOT_FOUND } from 'redux-first-router';
import restoreScroll from 'redux-first-router-restore-scroll';

import { BASE_URL, ENABLE_PUBLIC_ACCESS } from 'config';

const UNAUTHORIZED = 'UNAUTHORIZED';

export const ROUTES = {
  HOME: {
    path: '/',
    page: 'home',
    authenticated: !ENABLE_PUBLIC_ACCESS,
    authorized: !ENABLE_PUBLIC_ACCESS,
    fallbackRoute: null,
  },
  EARTH: {
    path: '/earth',
    page: 'earth',
    authenticated: !ENABLE_PUBLIC_ACCESS,
    authorized: !ENABLE_PUBLIC_ACCESS,
    fallbackRoute: null,
  },
  LOCATION: {
    path: '/earth/:organization/:slug',
    page: 'earth',
    authenticated: !ENABLE_PUBLIC_ACCESS,
    authorized: !ENABLE_PUBLIC_ACCESS,
    fallbackRoute: null,
  },
  ERROR: {
    path: '/error',
    page: 'error',
    authenticated: false,
    authorized: false,
    fallbackRoute: null,
  },
  [NOT_FOUND]: {
    path: '/404',
    page: 'not-found',
    authenticated: false,
    authorized: false,
    fallbackRoute: null,
  },
  [UNAUTHORIZED]: {
    path: '/unauthorized',
    page: 'unauthorized',
    authenticated: true,
    authorized: false,
    fallbackRoute: null,
  },
};

export const CONFIG = {
  basename: BASE_URL,
  location: 'router',
  querySerializer: {
    stringify: qs.stringify,
    parse: url => {
      return qs.parse(url, {
        arrayFormat: 'comma',
        parseNumbers: true,
        parseBooleans: true,
      })
    }
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
