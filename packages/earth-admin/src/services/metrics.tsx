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

interface ResponseSuccess {
  operationId?: string;
}

interface Error {
  code: number;
  title: string;
  detail: string;
}

interface ResponseError {
  errors: Error[];
}

const calculateAllForPlace = async (
  placeId: string,
  query?: RequestQuery
): Promise<ResponseSuccess | ResponseError> => {
  const params = { operationType: 'calculate' };
  return BaseAPIService.request(
    `/metrics/${placeId}/action`,
    {
      query: merge(params, query),
      method: 'post',
    },
    metaDeserializer
  );
};

const calculateForPlace = async (
  placeId: string,
  metricId: string,
  query?: RequestQuery
): Promise<ResponseSuccess | ResponseError> => {
  const params = { operationType: 'calculate' };
  return BaseAPIService.request(
    `/metrics/${placeId}/${metricId}/action`,
    {
      query: merge(params, query),
      method: 'post',
    },
    metaDeserializer
  );
};

const getAllMetrics = async (query?: RequestQuery) => {
  return BaseAPIService.request('/metrics', { query }, metaDeserializer);
};

export default { calculateAllForPlace, calculateForPlace, getAllMetrics };
