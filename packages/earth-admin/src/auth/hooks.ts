import axios from 'axios';
import { routeToPage } from '../utils';

/**
 * Routes the user to the right place after login.
 * @param targetUrl
 */
export const onRedirectCallback = (targetUrl: string) => {
  // targetUrl from callback already contains basePath;
  routeToPage(targetUrl, true);
};

/**
 * Configure behaviour in case of successful login.
 * @param params
 */
export const onSuccessHook = (params: any = {}) => {
  const token = params.token;
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
};

/**
 * Configure behaviour in case of failed login.
 * @param params
 */
export const onFailureHook = (params: any = {}) => {
  const error = params.error;
  if (error) {
    if (error === 'unauthorized') {
      routeToPage('unauthorized');
    } else {
      routeToPage('error');
    }
  }
};
