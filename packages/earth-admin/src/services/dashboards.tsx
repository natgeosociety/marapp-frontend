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
import { deserializeData } from '../utils';
import { GATSBY_API_URL } from 'config';

const DashboardAPIService = {
  request: (options: AxiosRequestConfig) => {
    const instance = axios.create({
      baseURL: GATSBY_API_URL,
      timeout: 10000,
      // @ts-ignore
      transformResponse: axios.defaults.transformResponse.concat((data, headers) => ({
        data: data.data ? deserializeData(data) : data,
        pagination: data.meta ? data.meta.pagination : null,
        total: data.meta ? data.meta.results : null
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

export const getAllDashboards = async (dashboardQuery: string) => {
  return await DashboardAPIService.request({
    url: dashboardQuery,
  });
};

export const addDashboard = async (dashboard, group: string) =>
  await DashboardAPIService.request({
    url: `/dashboards?group=${group}`,
    method: 'post',
    data: dashboard,
  });

export const getDashboard = async (dashboardQuery: string) => {
  return await DashboardAPIService.request({
    url: dashboardQuery,
    method: 'get',
  });
};

export const updateDashboard = async (dashboardId: string, dashboard, group: string) => {
  await DashboardAPIService.request({
    url: `/dashboards/${dashboardId}?group=${group}`,
    method: 'put',
    data: dashboard,
  });
};

export const deleteDashboards = async (dashboardId: string, group: string) => {
  return await DashboardAPIService.request({
    url: `/dashboards/${dashboardId}?group=${group}`,
    method: 'delete',
  });
};

export const handleDashboardForm = async (
  newDashboard: boolean,
  dashboard,
  dashboardId: string,
  group: string
) =>
  newDashboard
    ? await addDashboard(dashboard, group)
    : await updateDashboard(dashboardId, dashboard, group);
