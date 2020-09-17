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

import { useState, useEffect } from 'react';
import { useSWRInfinite } from 'swr';
import { compose, add } from 'lodash/fp';

interface IError {
  details: string;
  message: string;
}

export function useDomWatcher(ref, callback, skip) {
  useEffect(() => {
    if (skip) return;

    const handleClickOutside = event => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback && callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, skip]);
}

/**
 * Custom hook that integrates useSWRInfinite with <DataListing /> component
 * @param getQuery Function responsible for returning the api url
 * @param fetcher Function queries the api
 */
export function useInfiniteList(
  getQuery: (pageIndex: number) => string,
  fetcher: (any) => Promise<any>
) {
    // Our api starts with page 1 instead of 0, so we increment the pageIndex
  const offsetGetQuery = compose(getQuery, add(1));
  const {
    data: response = [],
    error,
    isValidating,
    size,
    setSize,
    mutate,
  } = useSWRInfinite(offsetGetQuery, fetcher);

  // Merge multiple page results into a single list of results
  const items = response.reduce((acc: any, { data, ...rest }: any) => {
    return {
      data: acc.data.concat(data),
      ...rest,
    }
  }, { data: [] });

  return {
    // props for <DataListing />
    listProps: {
      data: items.data,
      cursorAction: () => setSize(size + 1),
      isLoading: isValidating,
      isNoMore: items.data.length >= items.total,
      totalResults: items.total,
    },
    mutate,
    error,
  }
}
