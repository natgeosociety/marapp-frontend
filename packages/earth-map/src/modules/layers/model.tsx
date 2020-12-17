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

export interface ILayer {
  id: string;
  slug?: string;
  name?: string;
  description: string;
  type?: LayerType;
  organization?: string;
  provider?: LayerProvider;
  category: LayerCategory[];
  legendConfig: object;
  layerConfig: ILayerConfig;
  decodeFunction?: any;
  interactionConfig: any;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  references?: any;
  source?: any;
  paramsConfig?: any;
  sqlConfig?: any;
  decodeConfig?: any;
  timelineConfig?: any;
  render?: any;
}

export interface ILayerRaw extends ILayer {
  config: any;
}

interface ILayerConfig {
  paramsConfig: any;
  sqlConfig: any;
  decodeConfig: any;
  timelineConfig: any;
  type: LayerType;
  layers: ILayer[];
  body: any;
}

export enum LayerCategory {
  BIODIVERSITY = 'Biodiversity',
  CLIMATE_CARBON = 'Climate & Carbon',
  ECOSYSTEM_SERVICES = 'Ecosystem Services',
  HUMAN_IMPACT = 'Human Impact',
  LAND_COVER = 'Land Cover',
  MARINE = 'Marine',
  NATURAL_HAZARDS = 'Natural Hazards',
  PROTECTED_AREAS = 'Protected Areas',
  RESTORATION = 'Restoration',
  SOCIO_ECONOMIC = 'Socio-Economic',
}

export enum LayerType {
  raster = 'raster',
  vector = 'vector',
  geojson = 'geojson',
  group = 'group',
  video = 'video',
}

export enum LayerProvider {
  cartodb = 'cartodb',
  gee = 'gee',
  mapbox = 'mapbox',
  leaflet = 'leaflet',
}
