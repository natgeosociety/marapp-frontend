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

import { GATSBY_API_URL } from '@app/config';

import { deserializeData, encodeQueryToURL } from '../utils';

const WidgetAPIService = {
  request: (options: AxiosRequestConfig) => {
    const instance = axios.create({
      baseURL: GATSBY_API_URL,
      timeout: 10000,
      // @ts-ignore
      transformResponse: axios.defaults.transformResponse.concat((data, headers) => ({
        data: data.data ? deserializeData(data) : data,
        pagination: data.meta ? data.meta.pagination : null,
        filters: data.meta ? data.meta.filters : null,
        total: data.meta ? data.meta.results : null,
      })),
    });

    return new Promise((resolve, reject) => {
      instance
        .request(options)
        .then((res) => resolve(res.data))
        .catch((error) => {
          if (error.response) {
            reject(error.response.data);
          } else {
            reject(error);
          }
        });
    });
  },
};

export const getAllWidgets = async (widgetQuery: string) =>
  WidgetAPIService.request({
    url: widgetQuery,
  });

export const addWidget = async (widget, group: string) =>
  WidgetAPIService.request({
    url: encodeQueryToURL('/widgets', { group }),
    method: 'post',
    data: widget,
  });

export const getWidget = async (widgetQuery: string) =>
  WidgetAPIService.request({
    url: widgetQuery,
    method: 'get',
  });

export const updateWidget = async (widgetId: string, widget, group: string) =>
  WidgetAPIService.request({
    url: encodeQueryToURL(`/widgets/${widgetId}`, { group }),
    method: 'put',
    data: widget,
  });

export const deleteWidgets = async (widgetID: string, group: string) =>
  WidgetAPIService.request({
    url: encodeQueryToURL(`/widgets/${widgetID}`, { group }),
    method: 'delete',
  });

export const handleWidgetForm = async (
  newWidget: boolean,
  widget,
  widgetId: string,
  group: string
) => (newWidget ? addWidget(widget, group) : updateWidget(widgetId, widget, group));

export const getWidgetSlug = async (keyword: string, group: string, type: string = 'counter') =>
  WidgetAPIService.request({
    url: encodeQueryToURL('/widgets/slug', { keyword, group, type }),
  });
