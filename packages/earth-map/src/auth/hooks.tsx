import axios from 'axios';

import { routeToPage } from 'utils';

/**
 * Routes the user to the right place after login.
 * @param params
 */
export const onRedirectCallback = (params: { targetUrl?: string } = {}) => {
  const { targetUrl } = params;

  // targetUrl from callback already contains basePath;
  routeToPage({ basePath: '/', targetPath: targetUrl });
};

/**
 * Configure behaviour in case of successful login.
 * @param params
 */
export const onSuccessHook = (params: { token?: string } = {}) => {
  const { token } = params;
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
};

/**
 * Configure behaviour in case of failed login.
 * @param params
 */
export const onFailureHook = (params: { error?: any } = {}) => {
  const { error } = params;

  if (error === 'unauthorized') {
    routeToPage({ targetPath: 'unauthorized' });
  } else {
    routeToPage({ targetPath: 'error' });
  }
};
