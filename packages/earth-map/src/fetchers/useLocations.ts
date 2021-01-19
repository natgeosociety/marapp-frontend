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

import { noop } from 'lodash/fp';
import { groupBy, sortBy } from 'lodash';
import { useSWRInfinite } from 'swr';
import { BaseAPIService, metaDeserializer } from 'services/base/APIBase';
import { encodeQueryToURL } from 'utils/query';

interface IQuery {
  filter?: string;
  search?: string;
  select?: string;
  group?: string;
  sort?: string;
  page?: {
    size?: number;
    cursor?: string;
  };
}

const DEFAULT_PAGE_SIZE = 30;

export default function useLocations(query: IQuery) {
  const swrKeyLoader = (pageIndex: number, previousPage: any): string => {
    if (previousPage && !previousPage.data) {
      return null; // reached the end;
    }
    const cursor = pageIndex === 0 ? -1 : previousPage?.meta?.pagination?.nextCursor;
    const defaults = {
      sort: 'name',
      select: 'name',
      page: { size: DEFAULT_PAGE_SIZE, cursor },
    };

    const finalQuery = {
      ...defaults,
      ...query,
    };

    return encodeQueryToURL('/locations', finalQuery);
  };
  const fetcher = (url) => {
    return BaseAPIService.requestSWR(url, undefined, metaDeserializer).then((response) => {
      const transformer = (payload) => {
        const filtersWithLabels = payload.map((filter) => ({
          ...filter,
          label: filter.value,
          ...(typeof filter.value === 'boolean' && {
            label: filter.value ? 'Yes' : 'No',
            value: filter.value ? 'true' : 'false',
          }),
        }));

        const availableFilters = groupBy(sortBy(filtersWithLabels, 'value'), 'key');

        return availableFilters;
      };

      const result = {
        ...response,
        meta: {
          ...response.meta,
          filters: transformer(response.meta.filters),
        },
      };

      return result;
    });
  };

  const { data: rawData, isValidating, size, setSize }: any = useSWRInfinite(swrKeyLoader, fetcher);

  if (!rawData) {
    return {};
  }

  const lastPage = rawData[rawData.length - 1] || {};
  const data = rawData.map((item) => item.data).flat();
  const metadata = lastPage.meta || {};
  const isNoMore = !metadata.pagination?.nextCursor;
  const awaitMore = !isValidating && !isNoMore;

  return {
    data,
    metadata,
    isNoMore,
    awaitMore,
    nextPage: awaitMore ? () => setSize(size + 1) : noop,
    previousPage: size === 0 ? noop : () => setSize(size - 1),
    isValidating,
  };
}
