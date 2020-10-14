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

import { merge } from 'lodash/fp';

import { BaseAPIService, RequestQuery } from './base/APIBase';

const getAllLayers = async (query?: RequestQuery) => {
  return BaseAPIService.request('/layers', { query });
};

const addLayer = async (data: any, query?: RequestQuery) => {
  return BaseAPIService.request('/layers', { query, method: 'post', data });
};

const getLayer = (layerId: string, query?: RequestQuery) => {
  return BaseAPIService.request(`/layers/${layerId}`, { query });
};

const updateLayer = async (layerId: string, data: any, query?: RequestQuery) => {
  return BaseAPIService.request(`/layers/${layerId}`, { query, method: 'put', data });
};

const deleteLayer = async (layerId: string, query?: RequestQuery) => {
  return BaseAPIService.request(`/layers/${layerId}`, { query, method: 'delete' });
};

const getLayerSlug = async (keyword: string, query?: RequestQuery) => {
  const params = { keyword, type: 'counter' };
  return BaseAPIService.request('/layers/slug', { query: merge(params, query) });
};

const handleLayerForm = async (
  newLayer: boolean,
  data: any,
  layerId: string,
  query?: RequestQuery
) => {
  return newLayer ? addLayer(data, query) : updateLayer(layerId, data, query);
};

export default {
  getAllLayers,
  addLayer,
  getLayer,
  updateLayer,
  deleteLayer,
  getLayerSlug,
  handleLayerForm,
};
