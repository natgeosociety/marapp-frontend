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
import { deserializeData } from '@app/utils';

interface ResponseSuccess {
  operationId?: string;
}

interface ResponseError {
  errors: [
    {
      code: number;
      title: string;
      detail: string;
    }
  ];
}

const MetricAPIService = {
  request: (options: AxiosRequestConfig) => {
    const instance = axios.create({
      baseURL: GATSBY_API_URL,
      timeout: 10000,
      // @ts-ignore
      transformResponse: axios.defaults.transformResponse.concat((data, headers) => ({
        data: data.data ? deserializeData(data) : data,
        pagination: data.meta ? data.meta.pagination : null,
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

export const calculateAllForPlace = async (
  placeId: string,
  selectedGroup: string
): Promise<ResponseSuccess | ResponseError> => {
  return MetricAPIService.request({
    url: `/metrics/${placeId}/action?group=${selectedGroup}`,
    method: 'post',
    params: {
      operationType: 'calculate',
    },
  });
};

export const calculateForPlace = async (
  placeID: string,
  metricId: string,
  selectedGroup: string
): Promise<ResponseSuccess | ResponseError> => {
  return MetricAPIService.request({
    url: `/metrics/${placeID}/${metricId}/action?group=${selectedGroup}`,
    method: 'post',
    params: {
      operationType: 'calculate',
    },
  });
};
