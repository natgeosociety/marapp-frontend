import axios, { AxiosRequestConfig } from 'axios';
import { deserializeData } from '../utils';
import { GATSBY_API_URL } from 'config';

const UserAPIService = {
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

export const getAllUsers = async (userQuery: string) => {
  return await UserAPIService.request({
    url: userQuery,
  });
};

export const addUser = async (request, group: string) => {
  return await UserAPIService.request({
    url: `/users?group=${group}`,
    method: 'post',
    data: request,
  });
};

export const getUser = (userQuery: string) => {
  return UserAPIService.request({
    url: userQuery,
    method: 'get',
  });
};

export const getAvailableGroups = async (group: string) => {
  return await UserAPIService.request({
    url: `/users/groups?group=${group}`,
    method: 'get',
  });
};

export const updateUser = async (userID: string, user, group: string) => {
  return await UserAPIService.request({
    url: `/users/${userID}?group=${group}`,
    method: 'put',
    data: user,
  });
};

export const deleteUser = async (userID: string, group: string) => {
  return await UserAPIService.request({
    url: `/users/${userID}?group=${group}`,
    method: 'delete',
  });
};

export const handleUserForm = async (
  newUser: boolean,
  user,
  userID: string,
  group: string
) => {
  newUser
    ? await addUser(user, group)
    : await updateUser(userID, user, group);
};