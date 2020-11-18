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

export interface IPlace {
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
  organization?: string;
  metrics?: LocationMetricsProps[] | string[];
  intersections?: LocationIntersection[] | string[];
  $searchHint?: {
    [prop: string]: string;
  };
}

export enum LocationTypeEnum {
  COUNTRY = 'Country',
  JURISDICTION = 'Jurisdiction',
  BIOME = 'Biome',
  PROTECTED_AREA = 'Protected Area',
  SPECIES_AREA = 'Species Area',
  COLLECTION = 'Collection',
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

export interface LocationIntersection {
  name?: string;
  id?: string;
  type?: 'country' | 'jurisdiction' | 'continent';
}

export interface IFilter {
  key: string;
  value: string;
  count: number;
}
