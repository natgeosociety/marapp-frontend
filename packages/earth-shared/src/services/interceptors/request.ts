import { AxiosRequestConfig } from 'axios';

/**
 * Noop request interceptor.
 */
export const reqNoopInterceptor = (config?: any) => {
  return async (config: AxiosRequestConfig): Promise<any> => {
    return config;
  };
};
