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

const getAllDashboards = async (query?: string | RequestQuery) => {
  return BaseAPIService.request('/dashboards', { query }, metaDeserializer);
};

const addDashboard = async (data: any, query?: RequestQuery) => {
  return BaseAPIService.request('/dashboards', { query, method: 'post', data }, metaDeserializer);
};

const getDashboard = async (dashboardId: string, query?: RequestQuery) => {
  return BaseAPIService.request(`/dashboards/${dashboardId}`, { query }, metaDeserializer);
};

const updateDashboard = async (dashboardId: string, data: any, query?: RequestQuery) => {
  return BaseAPIService.request(
    `/dashboards/${dashboardId}`,
    {
      method: 'put',
      data,
      query,
    },
    metaDeserializer
  );
};

const deleteDashboards = async (dashboardId: string, query?: RequestQuery) => {
  return BaseAPIService.request(
    `/dashboards/${dashboardId}`,
    { query, method: 'delete' },
    metaDeserializer
  );
};

const getDashboardSlug = async (keyword: string, query?: RequestQuery) => {
  const params = { keyword, type: 'counter' };
  return BaseAPIService.request(
    '/dashboards/slug',
    { query: merge(params, query) },
    metaDeserializer
  );
};

const handleDashboardForm = async (
  newDashboard: boolean,
  data: any,
  dashboardId: string,
  query?: RequestQuery
) => {
  return newDashboard ? addDashboard(data, query) : updateDashboard(dashboardId, data, query);
};

export default {
  getAllDashboards,
  addDashboard,
  getDashboard,
  updateDashboard,
  deleteDashboards,
  getDashboardSlug,
  handleDashboardForm,
};
