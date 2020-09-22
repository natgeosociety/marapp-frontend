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

import { AxiosInstance } from 'axios';
import { setup } from 'axios-cache-adapter';
import { API_URL } from 'config';
import Jsona, { SwitchCaseJsonMapper, SwitchCaseModelMapper } from 'jsona';
import { encodeQueryToURL } from 'utils/query';

/**
 * Places service class.
 */
class PlacesService {
  private dataFormatter: Jsona;
  private api: AxiosInstance;

  /**
   * Creates dataFormatter and add it to service.
   * @constructor
   */
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
  public request(path) {
    return new Promise((resolve, reject) => {
      this.api
        .get(path)
        .then((response) => {
          const result = this.dataFormatter.deserialize(response.data);
          resolve({
            data: result,
            meta: response.data.meta,
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

export const service = new PlacesService();

// ROUTES
export function fetchPlace(id, options = {}) {
  const locationsQuery = encodeQueryToURL(`/locations/${id}`, options);
  return service.request(locationsQuery);
}

export function fetchPlaces(options = {}) {
  const locationsQuery = encodeQueryToURL(`/locations`, options);
  return service.request(locationsQuery);
}

export default service;
