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

export interface Location {
  id: string;
  slug?: string;
  name?: string;
  description: string;
  type: LocationTypeEnum;
  geojson?: {};
  published?: boolean;
  featured?: boolean;
  bbox2d?: number[];
  areaKm2?: number;
  centroid?: {};
  createdAt?: Date;
  updatedAt?: Date;
  version?: number;
  metrics?: LocationMetricsProps[] | string[];
  intersections?: LocationIntersection[] | string[];
}

export interface LocationContextProps {
  locations: Location[];
  handleSearchValueChange: (newValue: string) => void;
  handleCursorChange: Function;
  pagination: {
    pageCursor: string;
  };
  isLoading: boolean;
  isNoMore: boolean;
  searchValue?: string;
  permissions?: any;
}

export enum LocationTypeEnum {
  CONTINENT = 'Continent',
  COUNTRY = 'Country',
  JURISDICTION = 'Jurisdiction',
  BIOME = 'Biome',
  PROTECTED_AREA = 'Protected Area',
  SPECIES_AREA = 'Species Area',
}

export interface MetricProps {
  id: any;
  slug?: string;
  metric?: object;
  createdAt?: Date;
  updatedAt?: Date;
  version?: number;
  location?: string | Location;
}

export interface LocationMetricsProps {
  data: MetricProps;
  handlers: {
    handleServerErrors: Function;
  };
}

export interface LocationProps {
  data?: Location;
  newLocation?: boolean;
}

export interface LocationIntersectionProps {
  intersections?: LocationIntersection[];
  name?: string;
}

export interface LocationIntersection {
  name?: string;
  id?: string;
  type?: 'country' | 'jurisdiction' | 'continent';
}

export const LOCATION_METRICS_VISUAL_MAPPING = {
  default: {
    icon: 'warning',
    color: '#FFD500',
  },
  'biodiversity-intactness': {
    icon: 'atlas',
    color: '#26A406',
  },
  'human-footprint': {
    icon: 'walker',
    color: 'rgb(230, 44, 144)',
  },
  'land-use': {
    icon: 'home',
    color: '#356122',
  },
  'terrestrial-carbon': {
    icon: 'compass',
    color: 'rgb(253, 158, 89)',
  },
  'human-impact': {
    icon: 'family',
    color: '#FFBC00',
  },
  'tree-loss': {
    icon: 'atlas-globe',
    color: 'rgb(253, 107, 133)',
  },
  'protected-areas': {
    icon: 'search',
    color: '#966DB3',
  },
  'modis-fire': {
    icon: 'idea',
    color: '#BA1001',
  },
  'modis-evi': {
    icon: 'idea',
    color: '#00BAAA',
  },
};
