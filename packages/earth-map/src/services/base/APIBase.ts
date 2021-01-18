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

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { merge } from 'lodash/fp';
import { Deserializer } from 'ts-jsonapi';

import { API_URL } from '../../config';
import { encodeQueryToURL } from '../../utils/query';

export interface RequestQuery {
  [key: string]: any;
}
export type RequestMethod = 'get' | 'post' | 'put' | 'delete';
export interface RequestConfig {
  query?: RequestQuery;
  method?: RequestMethod;
  data?: any;
}

const TIMEOUT = 30000;

export const DeserializerService = new Deserializer({
  keyForAttribute: (attribute: any) => {
    return attribute;
  },
});

export const BaseAPIService = {
  /**
   * Creates an axios request based on path and request options.
   * @param path: identifies the specific resource in the host
   * @param config
   * @param deserializer: JSON:API deserializer
   */
  request: (
    path: string,
    config: RequestConfig,
    deserializer: (response: AxiosResponse) => any = BaseAPIService.deserialize
  ) => {
    const defaults = { query: {}, method: 'get', data: {} };
    const params = merge(defaults, config);

    const options: AxiosRequestConfig = {
      baseURL: API_URL,
      url: encodeQueryToURL(path, params.query),
      method: params.method,
      data: params.data,
      timeout: TIMEOUT,
    };

    return new Promise((resolve, reject) => {
      axios
        .request(options)
        .then((response) => resolve(deserializer(response)))
        .catch((error) =>
          reject(error?.response?.data?.data ? deserializer(error?.response) : error?.response)
        );
    });
  },
  /**
   * JSON:API deserializer
   * @param response
   */
  deserialize: (response: AxiosResponse): any => {
    return DeserializerService.deserialize(response.data);
  },
};

/**
 * JSON:API meta deserializer
 * @param response
 */
export const metaDeserializer = (response: AxiosResponse): any => {
  return {
    data: DeserializerService.deserialize(response?.data),
    meta: response?.data?.meta,
  };
};
