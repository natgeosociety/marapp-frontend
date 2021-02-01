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
import { useSWRInfinite, SWRInfiniteResponseInterface } from 'swr';

import { BaseAPIService, metaDeserializer } from '../services/base/APIBase';
import { PAGE_SIZE } from '../theme';
import { encodeQueryToURL } from '../utils/query';

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

interface IBaseResponseMany {
  data: any[];
  meta: any;
  isNoMore: boolean;
  awaitMore: boolean;
  nextPage: () => void;
  previousPage: () => void;
}

export type IResponseMany = Partial<IBaseResponseMany> & SWRInfiniteResponseInterface;

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
): IResponseMany {
  const options = {
    ...defaultOptions,
    ...passedOptions,
  };
  const swrKeyLoader = (pageIndex: number, previousPage: any): string => {
    // skip data fetching
    if (!query) {
      return null;
    }

    // reached the end;
    if (previousPage && !previousPage.data) {
      return null;
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

  const response = useSWRInfinite(swrKeyLoader, fetcher, options.swrOptions);

  const { data: rawData, isValidating, size, setSize } = response;

  if (!rawData) {
    return response;
  }

  const lastPage = rawData[rawData.length - 1] || {};

  // combine array of pages in a single list of results
  const flatData = rawData.map((item) => item.data).flat();
  const meta = lastPage.meta || {};
  const isNoMore = !meta.pagination?.nextCursor;
  const awaitMore = !isValidating && !isNoMore;

  return {
    ...response,
    data: flatData,
    meta,
    isNoMore,
    awaitMore,
    nextPage: awaitMore ? () => setSize(size + 1) : noop,
    previousPage: size === 0 ? noop : () => setSize(size - 1),
  };
}
