import { Auth0Client } from '@auth0/auth0-spa-js';
import axios, { AxiosResponse } from 'axios';

/**
 * Noop response interceptor.
 */
export const resSuccessInterceptor = (config?: any) => {
  return async (response: AxiosResponse): Promise<any> => {
    return response;
  };
};

/**
 * Unauthorized response interceptor.
 * The response interceptor checks to see if the API returned a 401 status code
 * due to an expired token.
 * It then forces a token refresh and updates the Authorization header globally.
 */
export const resErrorInterceptor = (config: { authClient: Auth0Client }) => {
  return async (error: any): Promise<any> => {
    const request = error.config;

    if (error.response.status === 401 && !request._retry) {
      request._retry = true;
      try {
        const accessToken = await config.authClient.getTokenSilently();
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        request.headers.Authorization = `Bearer ${accessToken}`;
      } catch (err) {
        console.error(err);
      }
      return axios.request(request);
    }
    return Promise.reject(error);
  };
};
