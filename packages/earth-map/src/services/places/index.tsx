import { setup } from 'axios-cache-adapter';
import Jsona, { SwitchCaseJsonMapper, SwitchCaseModelMapper } from 'jsona';
import { encodeQueryToURL } from 'utils/query';
import { AxiosInstance } from 'axios';

/**
 * Places service class
 * It is a singleton for not instanciate Jsona on each request.
 */
class PlacesService {
  private dataFormatter: Jsona;
  private api: AxiosInstance;

  /**
   * Creates dataFormatter and add it to service.
   * @constructor
   */
  constructor() {
    this.configure();

    this.dataFormatter = new Jsona({
      modelPropertiesMapper: new SwitchCaseModelMapper(),
      jsonPropertiesMapper: new SwitchCaseJsonMapper(),
    });
  }

  configure = () => {
    this.api = setup({
      baseURL: `${process.env.REACT_APP_API_URL}`,
    });
  };

  /**
   * request
   * Creates an axios request based on type an options.
   * @param {string} type - The type of the request.
   * @param {object} options - The request options, these are forwarded to axios.
   */
  request(path) {
    return new Promise((resolve, reject) => {
      this.api
        .get(path)
        .then(response => {
          const result = this.dataFormatter.deserialize(response.data);
          resolve({
            data: result,
            meta: response.data.meta,
          });
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}

export const service = new PlacesService();

// ROUTES
export function fetchPlace(id, options = {}) {
  const locationsQuery = encodeQueryToURL(`/locations/${id}`, options);
  return service.request(locationsQuery);
}

export function fetchPlaces(options = {}) {
  const locationsQuery = encodeQueryToURL(`/locations`, options);
  return service.request(locationsQuery);
}

export default service;
