import axios, { AxiosRequestConfig } from 'axios';
import { deserializeData } from '../utils';
import { GATSBY_API_URL } from 'config';

const OrganizationAPIService = {
  request: (options: AxiosRequestConfig) => {
    const instance = axios.create({
      baseURL: GATSBY_API_URL,
      timeout: 100000,
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
        .catch((error) => {
          reject(error.response.data);
        });
    });
  },
};

export const getAllOrganizations = async (organizationQuery: string) => {
  return await OrganizationAPIService.request({
    url: organizationQuery,
  });
};

export const getOrganization = (organizationQuery: string) => {
  return OrganizationAPIService.request({
    url: organizationQuery,
    method: 'get',
  });
};

export const updateOrganization = async (organizationID: string, organization, group: string) => {
  return await OrganizationAPIService.request({
    url: `/organizations/${organizationID}?group=${group}`,
    method: 'put',
    data: organization,
  });
};

// export const handleOrganizationForm = async (
//   newOrg: boolean,
//   organization,
//   organizationID: string,
//   group: string
// ) => {
//   newOrg ? null : await updateOrganization(organizationID, organization, group);
// };