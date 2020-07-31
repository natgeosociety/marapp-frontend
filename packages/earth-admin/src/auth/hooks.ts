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
