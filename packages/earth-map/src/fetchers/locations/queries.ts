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
import { serializeFilters } from '@marapp/earth-shared';

import { IPlace, LocationTypeEnum } from '../../modules/places/model';
import { IQueryMany } from '../useFetchMany';
import { IQueryOne } from '../useFetchOne';

export const QUERY_LOCATIONS = {
  getLatestCollections(): IQueryMany {
    return {
      select: 'slug,name,id,organization,type,updatedAt',
      filter: ['type', '==', LocationTypeEnum.COLLECTION].join(''),
      page: { size: 5 },
      sort: '-updatedAt',
    };
  },

  getFiltered(search: string, filters): IQueryMany {
    return {
      search,
      filter: serializeFilters(filters),
      select: 'name,slug,organization,type',
    };
  },

  getFeatured(): IQueryMany {
    return {
      select: 'slug,name,id,organization,type',
      page: { size: 100 },
      filter: 'featured==true',
      sort: 'name',
    };
  },

  getCollection(group: string): IQueryOne {
    return {
      include: 'locations',
      select: 'locations.slug,locations.name',
      group,
    };
  },

  getOne(group): IQueryOne {
    return {
      include: 'metrics',
      group,
    };
  },
};

export interface ICollection {
  id: string;
  slug?: string;
  name?: string;
  description: string;
  organization?: string;

  // relationships
  locations?: IPlace[];
  metrics?: any[];

  published?: boolean;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  version?: number;
}
