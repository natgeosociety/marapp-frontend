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

import { BaseAPIService, RequestQuery } from './base/APIBase';

const getAllWidgets = async (query?: RequestQuery) => {
  return BaseAPIService.request('/widgets', {
    query,
  });
};

const addWidget = async (data: any, query?: RequestQuery) => {
  return BaseAPIService.request('/widgets', {
    query,
    method: 'post',
    data,
  });
};

const getWidget = async (widgetId: string, query?: RequestQuery) => {
  return BaseAPIService.request(`/widgets/${widgetId}`, {
    query,
  });
};

const updateWidget = async (widgetId: string, data: any, query?: RequestQuery) => {
  return BaseAPIService.request(`/widgets/${widgetId}`, {
    query,
    method: 'put',
    data,
  });
};

const deleteWidgets = async (widgetId: string, query?: RequestQuery) => {
  return BaseAPIService.request(`/widgets/${widgetId}`, {
    query,
    method: 'delete',
  });
};

const getWidgetSlug = async (keyword: string, query?: RequestQuery) => {
  const params = { keyword, type: 'counter' };
  return BaseAPIService.request('/widgets/slug', { query: merge(params, query) });
};

const handleWidgetForm = async (
  newWidget: boolean,
  data: any,
  widgetId: string,
  query?: RequestQuery
) => {
  return newWidget ? addWidget(data, query) : updateWidget(widgetId, data, query);
};

export default {
  getAllWidgets,
  addWidget,
  getWidget,
  updateWidget,
  deleteWidgets,
  getWidgetSlug,
  handleWidgetForm,
};
