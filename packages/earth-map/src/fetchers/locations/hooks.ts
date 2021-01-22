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
import { ConfigInterface, SWRInfiniteConfigInterface } from 'swr';
import { groupBy, sortBy } from 'lodash';
import { useFetchMany, IQueryMany } from '../useFetchMany';
import { useFetchOne, IQueryOne } from '../useFetchOne';
import { useAuth0 } from '../../auth/auth0';

export function useLocations(query: IQueryMany, swrOptions?: SWRInfiniteConfigInterface) {
  const { groups } = useAuth0();
  const specificQuery: IQueryMany = {
    ...query,
    group: groups.join(),
  };

  return useFetchMany('/locations', specificQuery, {
    swrOptions,
    transformResponse: (response) => {
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
    },
  });
}

export function useLocation(idOrSlug: string, query: IQueryOne, swrOptions?: ConfigInterface) {
  return useFetchOne(`/locations/${idOrSlug}`, query, {
    swrOptions,
  });
}
