import qs from 'query-string';
import { NOT_FOUND } from 'redux-first-router';
import restoreScroll from 'redux-first-router-restore-scroll';

const UNAUTHORIZED = 'UNAUTHORIZED';

export const ROUTES = {
  HOME: {
    path: '/',
    page: 'home',
    authenticated: true,
    authorized: true,
    fallbackRoute: UNAUTHORIZED,
  },
  EARTH: {
    path: '/earth',
    page: 'earth',
    authenticated: true,
    authorized: true,
    fallbackRoute: UNAUTHORIZED,
  },
  LOCATION: {
    path: '/earth/:organization/:slug',
    page: 'earth',
    authenticated: true,
    authorized: true,
    fallbackRoute: UNAUTHORIZED,
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
    authenticated: true,
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

const BASE_URL = process.env.REACT_APP_BASE_URL || '/';

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
