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
import { GATSBY_API_URL } from 'config';

import { deserializeData } from '../utils';

const PlacesAPIService = {
  request: (options: AxiosRequestConfig) => {
    const instance = axios.create({
      baseURL: GATSBY_API_URL,
      timeout: 100000,
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
        .catch((error) => {
          reject(error.response.data);
        });
    });
  },
};

export const getAllPlaces = async (placeQuery: string) => {
  return PlacesAPIService.request({
    url: placeQuery,
  });
};

export const addPlace = async (request, group: string) => {
  return PlacesAPIService.request({
    url: `/locations?group=${group}`,
    method: 'post',
    data: request,
  });
};

export const getPlace = (placeQuery: string) => {
  return PlacesAPIService.request({
    url: placeQuery,
    method: 'get',
  });
};

export const updatePlace = async (placeID: string, place, group: string) => {
  return PlacesAPIService.request({
    url: `/locations/${placeID}?group=${group}`,
    method: 'put',
    data: place,
  });
};

export const deletePlace = async (placeID: string, group: string) => {
  return PlacesAPIService.request({
    url: `/locations/${placeID}?group=${group}`,
    method: 'delete',
  });
};

export const handlePlaceForm = async (newPlace: boolean, place, placeID: string, group: string) => {
  newPlace ? await addPlace(place, group) : await updatePlace(placeID, place, group);
};

export const getUniqueSlug = async (keyword: string, group: string, type: string = 'counter') =>
  PlacesAPIService.request({
    url: `/locations/slug?keyword=${keyword}&group=${group}&type=${type}`,
  });
