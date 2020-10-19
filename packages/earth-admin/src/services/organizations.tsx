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

const getAllOrganizations = async (query?: string | RequestQuery) => {
  return BaseAPIService.request('/organizations', { query }, metaDeserializer);
};

const getOrganization = (orgId: string, query?: RequestQuery) => {
  return BaseAPIService.request(`/organizations/${orgId}`, { query }, metaDeserializer);
};

const getOrganizationStats = async (query?: RequestQuery) => {
  return BaseAPIService.request('/organizations/stats', { query }, metaDeserializer);
};

const updateOrganization = async (orgId: string, data: any, query?: RequestQuery) => {
  const params = { include: 'owners' };
  return BaseAPIService.request(
    `/organizations/${orgId}`,
    {
      query: merge(params, query),
      method: 'put',
      data,
    },
    metaDeserializer
  );
};

const addOrganization = async (data: any, query?: RequestQuery) => {
  return BaseAPIService.request(
    '/organizations',
    { query, method: 'post', data },
    metaDeserializer
  );
};

const deleteOrganization = async (orgId, query?: RequestQuery) => {
  return BaseAPIService.request(
    `/organizations/${orgId}`,
    {
      method: 'delete',
      query,
    },
    metaDeserializer
  );
};

export default {
  getAllOrganizations,
  getOrganization,
  getOrganizationStats,
  updateOrganization,
  addOrganization,
  deleteOrganization,
};
