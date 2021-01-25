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

import { noop } from 'lodash';
import { useSWRInfinite } from 'swr';

import { BaseAPIService, metaDeserializer } from '../services/base/APIBase';
import { encodeQueryToURL } from '../utils/query';
import { PAGE_SIZE } from '../theme';

export interface IQueryMany {
  search?: string;
  filter?: string;
  include?: string;
  select?: string;
  sort?: string;
  page?: {
    size?: number;
    number?: number;
    cursor?: string;
  };
  group?: string;
  public?: boolean;
}

export interface IResponseMany {
  data: any;
  meta: any;
  isNoMore: boolean;
  awaitMore: boolean;
  isValidating: boolean;
  nextPage: () => void;
  previousPage: () => void;
}

interface IOptions {
  fetcher?: (url: string) => Promise<any>;
  transformResponse?: (response: any) => any;
  swrOptions?: {
    [key: string]: any;
  };
}

const defaultOptions = {
  fetcher: (url) => BaseAPIService.requestSWR(url, undefined, metaDeserializer),
  transformResponse: (response) => response,
  swrOptions: {},
};

export function useFetchMany(
  url: string,
  query: IQueryMany,
  passedOptions?: IOptions
): IResponseMany | Object {
  const options = {
    ...defaultOptions,
    ...passedOptions,
  };
  const swrKeyLoader = (pageIndex: number, previousPage: any): string => {
    if (previousPage && !previousPage.data) {
      return null; // reached the end;
    }
    const cursor = pageIndex === 0 ? -1 : previousPage?.meta?.pagination?.nextCursor;
    const defaults = {
      page: { size: PAGE_SIZE, cursor },
    };
    const finalQuery = {
      ...defaults,
      ...query,
    };

    return encodeQueryToURL(url, finalQuery);
  };

  const fetcher = (url) => {
    return options.fetcher(url).then(options.transformResponse);
  };
  const { data: rawData, isValidating, size, setSize }: any = useSWRInfinite(
    swrKeyLoader,
    fetcher,
    options.swrOptions
  );

  if (!rawData) {
    return {};
  }

  const lastPage = rawData[rawData.length - 1] || {};
  const data = rawData.map((item) => item.data).flat();
  const meta = lastPage.meta || {};
  const isNoMore = !meta.pagination?.nextCursor;
  const awaitMore = !isValidating && !isNoMore;

  return {
    data,
    meta,
    isNoMore,
    awaitMore,
    nextPage: awaitMore ? () => setSize(size + 1) : noop,
    previousPage: size === 0 ? noop : () => setSize(size - 1),
    isValidating,
  };
}
