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

import { useEffect, useRef } from 'react';

import { groupBy } from 'lodash';
import { noop } from 'lodash/fp';
import qs from 'query-string';
import { useSWRInfinite } from 'swr';
import queryStringEncode from 'query-string-encode';

export function useDomWatcher(
  callback: Function,
  skip?: boolean,
  targetSelector?: string
): React.RefObject<any> {
  const ref: React.RefObject<any> = useRef();

  useEffect(() => {
    if (skip) {
      return;
    }

    const handleClickOutside = (event) => {
      if (
        (ref.current && !ref.current.contains(event.target)) ||
        (targetSelector && !event.target.closest(targetSelector))
      ) {
        callback && callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [skip]);

  return ref;
}

/**
 * Custom hook that integrates useSWRInfinite with <DataListing /> component
 * @param getQueryFn: Function responsible for returning the request query
 * @param fetcher: API service which fetches the data
 * @param options:
 */
export function useInfiniteList(
  getQueryFn: (cursor: string) => { query: any; resourceType: string },
  fetcher: (any) => Promise<any>,
  options: object = {}
) {
  const swrKeyLoader = (pageIndex: number, previousPage: any): string => {
    if (previousPage && !previousPage.data) {
      return null; // reached the end;
    }
    const cursor = pageIndex === 0 ? -1 : previousPage?.meta?.pagination?.nextCursor;
    const { query, resourceType } = getQueryFn(cursor);

    return `${resourceType}?${queryStringEncode(query)}`;
    // return generateCacheKey(resourceType, query);
  };
  // const wrappedFetcher = async (pathQuery: string) => {
  //   // const [resource, query] = pathQuery.split('?');
  //   // const parsed = qs.parse(query);

  //   return fetcher(pathQuery);
  // };

  const {
    data: response = [],
    error,
    isValidating,
    size,
    setSize,
    mutate,
    revalidate,
  } = useSWRInfinite(swrKeyLoader, fetcher, options);

  const items = mergePages(response);
  const [firstPage = {}] = response;
  const lastPage = response[response.length - 1] || {};
  const totalResults = firstPage?.meta?.results;
  const filters = firstPage?.meta?.filters || [];
  const filtersWithLabel = filters.map((f) => ({
    ...f,
    label: f.value,
  }));
  const isNoMore = !lastPage?.meta?.pagination?.nextCursor;
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
    filters: groupBy(filtersWithLabel, 'key'),
    revalidate,
    mutate,
    error,
  };

  return returnValues;
}

export interface IMergedResults {
  data: any[];
  meta: {
    filters: Array<{ key: string; value: any; count: number }>;
    pagination?: {
      size: number;
      total: number;
      nextCursor?: string;
    };
    results?: number;
  };
}

/**
 * Merge multiple page results into a single list of results
 */
export function mergePages(pagedResponse: any[]): IMergedResults {
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
