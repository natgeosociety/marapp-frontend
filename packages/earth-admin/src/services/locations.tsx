import axios, { AxiosRequestConfig } from 'axios';
import { deserializeData } from '../utils';
import { GATSBY_API_URL } from 'config';

const LocationAPIService = {
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

export const getAllLocations = async (locationQuery: string) => {
  return await LocationAPIService.request({
    url: locationQuery,
  });
};

export const addLocation = async (request, group: string) => {
  return await LocationAPIService.request({
    url: `/locations?group=${group}`,
    method: 'post',
    data: request,
  });
};

export const getLocation = (locationQuery: string) => {
  return LocationAPIService.request({
    url: locationQuery,
    method: 'get',
  });
};

export const updateLocation = async (locationID: string, location, group: string) => {
  return await LocationAPIService.request({
    url: `/locations/${locationID}?group=${group}`,
    method: 'put',
    data: location,
  });
};

export const deleteLocation = async (locationID: string, group: string) => {
  return await LocationAPIService.request({
    url: `/locations/${locationID}?group=${group}`,
    method: 'delete',
  });
};

export const handleLocationForm = async (
  newLocation: boolean,
  location,
  locationID: string,
  group: string
) => {
  newLocation
    ? await addLocation(location, group)
    : await updateLocation(locationID, location, group);
};