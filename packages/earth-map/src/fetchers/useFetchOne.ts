/*
 * Copyright 2018-2020 National Geographic Society
 *
 * Use of this software does not constitute endorsement by National Geographic
 * Society (NGS). The NGS name and NGS logo may not be used for any purpose without
 * written permission from NGS.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 * this file except in compliance with the License. You may obtain a copy of the
 * License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

import useSWR from 'swr';
import { BaseAPIService, metaDeserializer } from '../services/base/APIBase';
import { encodeQueryToURL } from '../utils/query';

export interface IQueryOne {
  include?: string;
  select?: string;
  sort?: string;
  group?: string;
}

interface IOptions {
  fetcher?: (url: string) => Promise<any>;
  transformResponse?: (response: any) => any;
  swrOptions?: {
    [key: string]: any;
  };
}

const defaultOptions: IOptions = {
  fetcher: (url) => BaseAPIService.requestSWR(url, undefined, metaDeserializer),
  transformResponse: (response) => response,
  swrOptions: {},
};

export function useFetchOne(url: string, query: IQueryOne, passedOptions?: IOptions) {
  const options = {
    ...defaultOptions,
    ...passedOptions,
  };
  const fetcher = (url) => {
    return options.fetcher(url).then(options.transformResponse);
  };
  const finalUrl = encodeQueryToURL(url, query);

  return useSWR(finalUrl, fetcher, options.swrOptions);
}
