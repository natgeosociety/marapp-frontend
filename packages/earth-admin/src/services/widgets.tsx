import axios, { AxiosRequestConfig } from 'axios';
import { deserializeData } from '../utils';
import { GATSBY_API_URL } from 'config';

const WidgetAPIService = {
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

export const getAllWidgets = async (widgetQuery: string) => {
  return await WidgetAPIService.request({
    url: widgetQuery,
  });
};

export const addWidget = async (widget, group: string) =>
  await WidgetAPIService.request({ url: `/widgets?group=${group}`, method: 'post', data: widget });

export const getWidget = async (widgetQuery: string) => {
  return await WidgetAPIService.request({
    url: widgetQuery,
    method: 'get',
  });
};

export const updateWidget = async (widgetId: string, widget, group: string) => {
  await WidgetAPIService.request({
    url: `/widgets/${widgetId}?group=${group}`,
    method: 'put',
    data: widget,
  });
};

export const deleteWidgets = async (widgetID: string, group: string) => {
  return await WidgetAPIService.request({
    url: `/widgets/${widgetID}?group=${group}`,
    method: 'delete',
  });
};

export const handleWidgetForm = async (
  newWidget: boolean,
  widget,
  widgetId: string,
  group: string
) => (newWidget ? await addWidget(widget, group) : await updateWidget(widgetId, widget, group));
