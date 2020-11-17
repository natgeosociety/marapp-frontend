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

import { BaseAPIService, metaDeserializer, RequestQuery } from './base/APIBase';

const getAllPlaces = async (query?: string | RequestQuery) => {
  return BaseAPIService.request('/locations', { query }, metaDeserializer);
};

const addPlace = async (data: any, query?: RequestQuery) => {
  return BaseAPIService.request(
    '/locations',
    {
      query,
      method: 'post',
      data,
    },
    metaDeserializer
  );
};

const getPlace = (placeId: string, query?: RequestQuery, data?: any, method?) => {
  return BaseAPIService.request(
    `/locations/${placeId}`,
    {
      method: method ? method : 'get',
      data,
      query,
    },
    metaDeserializer
  );
};

const updatePlace = async (placeId: string, data: any, query?: RequestQuery) => {
  return BaseAPIService.request(
    `/locations/${placeId}`,
    {
      method: 'put',
      data,
      query,
    },
    metaDeserializer
  );
};

const deletePlace = async (placeId: string, query?: RequestQuery) => {
  return BaseAPIService.request(
    `/locations/${placeId}`,
    {
      method: 'delete',
      query,
    },
    metaDeserializer
  );
};

const getPlaceSlug = async (keyword: string, query?: RequestQuery) => {
  const params = { keyword, type: 'counter' };
  return BaseAPIService.request(
    '/locations/slug',
    { query: merge(params, query) },
    metaDeserializer
  );
};

const handlePlaceForm = async (
  newPlace: boolean,
  data: any,
  placeId: string,
  query?: RequestQuery
) => {
  return newPlace ? addPlace(data, query) : updatePlace(placeId, data, query);
};

export default {
  getAllPlaces,
  addPlace,
  getPlace,
  updatePlace,
  deletePlace,
  handlePlaceForm,
  getPlaceSlug,
};
