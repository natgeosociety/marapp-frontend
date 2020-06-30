import axios, { AxiosRequestConfig } from 'axios';
import { deserializeData } from 'utils';
import { GATSBY_API_URL } from 'config';

const LayerAPIService = {
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

export const getAllLayers = async (layerQuery: string) =>
  await LayerAPIService.request({ url: layerQuery });

export const addLayer = async (layer, group: string) =>
  await LayerAPIService.request({ url: `/layers?group=${group}`, method: 'post', data: layer });

export const getLayer = async (layerQuery: string) =>
  await LayerAPIService.request({
    url: layerQuery,
    method: 'get',
  });

export const updateLayer = async (layerId: string, layer, group: string) =>
  await LayerAPIService.request({
    url: `/layers/${layerId}?group=${group}`,
    method: 'put',
    data: layer,
  });

export const deleteLayer = async (layerId: string, group: string) =>
  await LayerAPIService.request({
    url: `/layers/${layerId}?group=${group}`,
    method: 'delete',
  });

export const handleLayerForm = async (newLayer: boolean, layer, layerId: string, group: string) =>
  newLayer ? await addLayer(layer, group) : await updateLayer(layerId, layer, group);
