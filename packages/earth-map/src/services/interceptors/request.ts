import { AxiosRequestConfig } from 'axios';

/**
 * Noop request interceptor.
 */
export const noopInterceptor = (config?: any) => {
  return async (config: AxiosRequestConfig): Promise<any> => {
    return config;
  };
};
