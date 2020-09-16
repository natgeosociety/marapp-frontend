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

import axios, { AxiosRequestConfig } from 'axios';

import { GATSBY_API_URL } from '@app/config';
import { addPlace, updatePlace } from '@app/services/places';
import { deserializeData } from '@app/utils';

const LayerAPIService = {
  request: (options: AxiosRequestConfig) => {
    const instance = axios.create({
      baseURL: GATSBY_API_URL,
      timeout: 10000,
      // @ts-ignore
      transformResponse: axios.defaults.transformResponse.concat((data, headers) => ({
        data: data.data ? deserializeData(data) : data,
        pagination: data.meta ? data.meta.pagination : null,
        total: data.meta ? data.meta.results : null,
      })),
    });

    return new Promise((resolve, reject) => {
      instance
        .request(options)
        .then((res) => resolve(res.data))
        .catch((error) => reject(error.response.data));
    });
  },
};

export const getAllLayers = async (layerQuery: string) =>
  LayerAPIService.request({ url: layerQuery });

export const addLayer = async (layer, group: string) =>
  LayerAPIService.request({ url: `/layers?group=${group}`, method: 'post', data: layer });

export const getLayer = (layerQuery: string) =>
  LayerAPIService.request({
    url: layerQuery,
    method: 'get',
  });

export const updateLayer = async (layerId: string, layer, group: string) =>
  LayerAPIService.request({
    url: `/layers/${layerId}?group=${group}`,
    method: 'put',
    data: layer,
  });

export const deleteLayer = async (layerId: string, group: string) =>
  LayerAPIService.request({
    url: `/layers/${layerId}?group=${group}`,
    method: 'delete',
  });

export const handleLayerForm = async (newLayer: boolean, layer, layerId: string, group: string) =>
  newLayer ? addLayer(layer, group) : updateLayer(layerId, layer, group);

export const getUniqueSlug = async (keyword: string, group: string, type: string = 'counter') =>
  LayerAPIService.request({
    url: `/layers/slug?keyword=${keyword}&group=${group}&type=${type}`,
  });
