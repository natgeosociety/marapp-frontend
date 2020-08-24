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

export interface Place {
  id: string;
  description: string;
  type: PlaceTypeEnum;
  slug?: string;
  name?: string;
  geojson?: {};
  published?: boolean;
  featured?: boolean;
  bbox2d?: number[];
  areaKm2?: number;
  centroid?: {};
  createdAt?: Date;
  updatedAt?: Date;
  version?: number;
  metrics?: PlaceMetricsProps[] | string[];
  intersections?: PlaceIntersection[] | string[];
}

export interface PlaceContextProps {
  places: Place[];
  handleSearchValueChange: (newValue: string) => void;
  handleCursorChange: () => void;
  pageSize: number;
  isLoading: boolean;
  isNoMore: boolean;
  searchValue?: string;
  permissions?: any;
  totalResults?: number;
  nextCursor?: string;
  selectedItem?: string;
}

export enum PlaceTypeEnum {
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
  location?: string | Place;
}

export interface PlaceMetricsProps {
  data: MetricProps;
  handlers: {
    handleServerErrors: Function;
  };
}

export interface PlaceProps {
  data?: Place;
  newPlace?: boolean;
}

export interface PlaceIntersectionProps {
  intersections?: PlaceIntersection[];
  name?: string;
}

export interface PlaceIntersection {
  name?: string;
  id?: string;
  type?: 'country' | 'jurisdiction' | 'continent';
}


export const PLACE_DETAIL_QUERY = {
  include: 'metrics,intersections',
  select: 'intersections.id,intersections.name,intersections.type,-metrics.metric',
  sort: 'intersections.name,metrics.slug,-metrics.version',
};
