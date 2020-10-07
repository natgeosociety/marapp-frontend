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

import { noop } from 'lodash/fp';
import { useSWRInfinite } from 'swr';

/**
 * Custom hook that integrates useSWRInfinite with <DataListing /> component
 * @param getQuery Function responsible for returning the api url
 * @param fetcher Function queries the api
 * @param options
 */
export function useInfiniteList(
  getQuery: (cursor: number | string) => string,
  fetcher: (any) => Promise<any>,
  options: object = {}
) {
  const wrappedQuery = (pageIndex: number, previousPageData: any): string => {
    // reached the end
    if (previousPageData && !previousPageData.data) {
      return null;
    }
    const cursor = pageIndex === 0 ? -1 : previousPageData.pagination.nextCursor;

    return getQuery(cursor);
  };
  const {
    data: response = [],
    error,
    isValidating,
    size,
    setSize,
    mutate,
    revalidate,
  } = useSWRInfinite(wrappedQuery, fetcher, options);

  const items = mergePages(response);
  const [firstPage] = response;
  const lastPage = response[response.length - 1];
  const totalResults = firstPage?.total;
  const isNoMore = !lastPage?.pagination.nextCursor;
  const awaitMore = !isValidating && !isNoMore;

  const returnValues = {
    // props for <DataListing />
    listProps: {
      data: items.data,
      // TODO: find out why onIntersection is called even if awaitMore=false
      // Even though onIntersection will fire, it will be a noop
      onIntersection: awaitMore ? () => setSize(size + 1) : noop,
      isLoading: isValidating,
      awaitMore,
      isNoMore,
      totalResults,
    },
    revalidate,
    mutate,
    error,
  };

  return returnValues;
}

export function useInfiniteListPaged(
  getQuery: (pageIndex: number) => string,
  fetcher: (any) => Promise<any>,
  options: object = {}
) {
  const wrappedQuery = (pageIndex: number): string => {
    const offsetPageIndex = pageIndex + 1;
    return getQuery(offsetPageIndex);
  };
  const {
    data: response = [],
    error,
    isValidating,
    size,
    setSize,
    mutate,
    revalidate,
  } = useSWRInfinite(wrappedQuery, fetcher, options);

  const items = mergePages(response);
  const isNoMore = items.data.length >= items.total;
  const totalResults = items.total;
  const awaitMore = !isValidating && !isNoMore;

  const returnValues = {
    // props for <DataListing />
    listProps: {
      data: items.data,
      // TODO: find out why onIntersection is called even if awaitMore=false
      // Even though onIntersection will fire, it will be a noop
      onIntersection: awaitMore ? () => setSize(size + 1) : noop,
      isLoading: isValidating,
      awaitMore,
      isNoMore,
      totalResults,
    },
    revalidate,
    mutate,
    error,
  };

  return returnValues;
}

interface IMergedResults {
  data: Array<any>;
  pagination?: {
    size: number;
    total: number;
    nextCursor?: string;
  };
  total?: number;
}

/**
 * Merge multiple page results into a single list of results
 */
export function mergePages(pagedResponse: Array<any>): IMergedResults {
  return pagedResponse.reduce(
    (acc: any, { data, ...rest }: any) => {
      return {
        data: acc.data.concat(data),
        ...rest,
      };
    },
    { data: [] }
  );
}
