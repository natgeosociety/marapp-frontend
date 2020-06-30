import axios, { AxiosRequestConfig } from 'axios';
import { deserializeData } from 'utils';
import { GATSBY_API_URL } from 'config';

interface ResponseSuccess {
  operationId?: string;
}

interface ResponseError {
  errors: [
    {
      code: number;
      title: string;
      detail: string;
    }
  ];
}

const MetricAPIService = {
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

export const calculateAllForLocation = async (
  locationId: string,
  selectedGroup: string
): Promise<ResponseSuccess | ResponseError> => {
  return MetricAPIService.request({
    url: `/metrics/${locationId}/action?group=${selectedGroup}`,
    method: 'post',
    params: {
      operationType: 'calculate',
    },
  });
};

export const calculateForLocation = async (
  locationId: string,
  metricId: string,
  selectedGroup: string
): Promise<ResponseSuccess | ResponseError> => {
  return MetricAPIService.request({
    url: `/metrics/${locationId}/${metricId}/action?group=${selectedGroup}`,
    method: 'post',
    params: {
      operationType: 'calculate',
    },
  });
};
