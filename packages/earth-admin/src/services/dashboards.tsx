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
