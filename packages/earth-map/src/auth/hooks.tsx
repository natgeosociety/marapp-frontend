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

import { Auth0Client } from '@auth0/auth0-spa-js';
import axios from 'axios';

import {
  reqNoopInterceptor,
  resErrorInterceptor,
  resSuccessInterceptor,
} from '@marapp/earth-shared';

import { routeToPage } from '../utils';

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
export const onSuccessHook = (params: { accessToken?: string; authClient?: Auth0Client } = {}) => {
  if (params.accessToken) {
    axios.defaults.headers.common.Authorization = `Bearer ${params.accessToken}`;
  }
  if (params.authClient) {
    axios.interceptors.request.use(reqNoopInterceptor());
    axios.interceptors.response.use(
      resSuccessInterceptor(),
      resErrorInterceptor({ authClient: params.authClient })
    );
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
