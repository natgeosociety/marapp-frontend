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

import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { setup } from 'axios-cache-adapter';
import { API_URL } from 'config';
import Jsona, { SwitchCaseJsonMapper, SwitchCaseModelMapper } from 'jsona';
import { encodeQueryToURL } from 'utils/query';

/**
 * Users service class.
 */
class UsersService {
  public api: AxiosInstance;
  private dataFormatter: Jsona;

  constructor() {
    this.configure();

    this.dataFormatter = new Jsona({
      modelPropertiesMapper: new SwitchCaseModelMapper(),
      jsonPropertiesMapper: new SwitchCaseJsonMapper(),
    });
  }

  public configure = () => {
    this.api = setup({ baseURL: API_URL });
  };

  /**
   * request
   * Creates an axios request based on type an options.
   * @param {string} path - The path of the request.
   */
  public request(options: AxiosRequestConfig) {
    return new Promise((resolve, reject) => {
      this.api
        .request(options)
        .then((response) => {
          resolve(this.dataFormatter.deserialize(response.data));
        })
        .catch((error) => reject(error.response.data));
    });
  }
}

export const service = new UsersService();

export function changeEmailConfirmation(options) {
  // return service.request({});

  return service.request({ url: `/users/profile/change-email`, data: options });
}

export function fetchProfile(options = {}) {
  const profileQuery = encodeQueryToURL(`/users/profile`, options);
  return service.request({ url: profileQuery });
}

export default service;
