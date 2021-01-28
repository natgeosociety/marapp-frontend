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

import { BaseAPIService, metaDeserializer, RequestQuery } from './base/APIBase';

const fetchProfile = async (query?: RequestQuery): Promise<any> => {
  return BaseAPIService.request('/users/profile', { query }, metaDeserializer);
};

const fetchProfileCountries = async (): Promise<any> => {
  return BaseAPIService.request('/profile/countries', null, metaDeserializer);
};

const updateProfile = async (data: any, query?: RequestQuery): Promise<any> => {
  return BaseAPIService.request('/users/profile', { query, method: 'put', data }, metaDeserializer);
};

const changeEmail = async (data: any, query?: RequestQuery): Promise<any> => {
  return BaseAPIService.request(
    '/users/profile/change-email',
    { method: 'post', query, data },
    metaDeserializer
  );
};

const changeEmailConfirmation = async (query?: RequestQuery): Promise<any> => {
  return BaseAPIService.request('/users/profile/change-email', { query }, metaDeserializer);
};

const resendEmailConfirmation = async (query?: RequestQuery): Promise<any> => {
  return BaseAPIService.request(
    '/users/profile/verify-email',
    { method: 'post' },
    metaDeserializer
  );
};

const cancelEmailChange = async (query?: RequestQuery): Promise<any> => {
  return BaseAPIService.request(
    'users/profile/change-email',
    { method: 'delete', query },
    metaDeserializer
  );
};

const resetPassword = async (query?: RequestQuery): Promise<any> => {
  return BaseAPIService.request(
    '/users/profile/change-password',
    { method: 'post', query },
    metaDeserializer
  );
};

const leaveOrganizations = async (data: any, query?: RequestQuery): Promise<any> => {
  return BaseAPIService.request(
    '/users/profile/organizations',
    { method: 'post', query, data },
    metaDeserializer
  );
};

const deleteAccount = async (): Promise<any> => {
  return BaseAPIService.request('/users/profile', { method: 'delete' }, metaDeserializer);
};

export default {
  fetchProfile,
  fetchProfileCountries,
  updateProfile,
  changeEmail,
  changeEmailConfirmation,
  cancelEmailChange,
  resetPassword,
  leaveOrganizations,
  deleteAccount,
  resendEmailConfirmation,
};
