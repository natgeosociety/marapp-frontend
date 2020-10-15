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

import { isString } from 'lodash/fp';
import qs from 'query-string';

import { BaseAPIService, RequestQuery } from './base/APIBase';

const getAllUsers = async (query?: string | RequestQuery) => {
  if (isString(query)) {
    query = qs.parse(query);
  }
  return BaseAPIService.request('/users', {
    query,
  });
};

const addUsers = async (data: any, query?: RequestQuery) => {
  return BaseAPIService.request('/users', {
    method: 'put',
    data,
    query,
  });
};

const getUser = (userId: string, query?: RequestQuery) => {
  return BaseAPIService.request(`/users/${userId}`, {
    query,
  });
};

const getAvailableGroups = async (query?: RequestQuery) => {
  return BaseAPIService.request('/users/groups', { query });
};

const updateUser = async (userId: string, data: any, query?: RequestQuery) => {
  return BaseAPIService.request(`/users/${userId}`, {
    method: 'put',
    data,
    query,
  });
};

const deleteUser = async (userId: string, query?: RequestQuery) => {
  return BaseAPIService.request(`/users/${userId}`, {
    method: 'delete',
    query,
  });
};

const handleUserForm = async (
  newUser: boolean,
  data: any,
  userId: string,
  query?: RequestQuery
) => {
  return newUser ? addUsers(data, query) : updateUser(userId, data, query);
};

export default {
  getAllUsers,
  addUsers,
  getUser,
  getAvailableGroups,
  updateUser,
  deleteUser,
  handleUserForm,
};
