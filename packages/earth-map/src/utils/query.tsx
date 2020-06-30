import queryStringEncode from 'query-string-encode';

/**
 * Url encode
 */

export const encodeQueryToURL = (baseUrl, query) =>
  [baseUrl, decodeURIComponent(queryStringEncode(query))].join('?');

export default { encodeQueryToURL };
