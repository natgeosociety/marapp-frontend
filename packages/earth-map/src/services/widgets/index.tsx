import { setup } from 'axios-cache-adapter';
import { encodeQueryToURL } from 'utils/query';
import Jsona, { SwitchCaseJsonMapper, SwitchCaseModelMapper } from 'jsona';
import { AxiosInstance } from 'axios';

/**
 * Widgets service class
 * It is a singleton for not instanciate Jsona on each request.
 */
class WidgetsService {
  private dataFormatter: Jsona;
  private api: AxiosInstance;

  constructor() {
    this.configure();

    this.dataFormatter = new Jsona({
      modelPropertiesMapper: new SwitchCaseModelMapper(),
      jsonPropertiesMapper: new SwitchCaseJsonMapper(),
    });
  }

  configure = () => {
    this.api = setup({
      // `axios` options
      baseURL: `${process.env.REACT_APP_API_URL}`,

      // This prevents RW cache
      headers: {
        'Upgrade-Insecure-Requests': 1,
      },
    });
  };

  /**
   * request
   * Creates an axios request based on type an options.
   * @param {string} path - The path of the request.
   * @param {object} options - The request options, these are forwarded to axios.
   */
  request(path) {
    return new Promise((resolve, reject) => {
      this.api
        .get(path)
        .then(response => {
          resolve(this.dataFormatter.deserialize(response.data));
          resolve(response.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}

export const service = new WidgetsService();

export function fetchWidgets(options = {}) {
  const widgetsQuery = encodeQueryToURL(`/widget`, options);
  return service.request(widgetsQuery);
}

export function fetchWidget(id, options = {}) {
  const widgetsQuery = encodeQueryToURL(`/widget/${id}`, options);
  return service.request(widgetsQuery);
}

export default service;
