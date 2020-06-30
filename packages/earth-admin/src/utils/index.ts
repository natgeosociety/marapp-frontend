import { navigate } from 'gatsby';
import { BASE_URL } from 'config';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';

import moment from 'moment';

const JSONAPIDeserializer = require('ts-jsonapi').Deserializer;
const DeserializerService = new JSONAPIDeserializer({
  keyForAttribute: (attribute: any) => {
    return attribute;
  },
});

import queryStringEncode from 'query-string-encode';

/**
 * Wrapper over navigate that takes into account baseURL.
 */
export const routeToPage = (targetPath: string, stripBase: boolean = false) => {
  let path = targetPath;
  if (stripBase && path !== '/') {
    path = path.replace(BASE_URL, '');
  }
  navigate(path);
};

/**
 * Deserializer
 */
export const deserializeData = (data) => DeserializerService.deserialize(data);

/**
 * Url encode
 */
export const encodeQueryToURL = (baseUrl: string, query: { [key: string]: any }): string =>
  [baseUrl, decodeURIComponent(queryStringEncode(query))].join('?');

/**
 * Strip numbers
 */
export const stripNumbers = (value: number = null) => value && value.toFixed(3);

/**
 * Date formatter
 */
export const formatDate = (date: Date): string => {
  return moment(date).format('YYYY-MM-DD');
};

/**
 * Validate a JWTs `scope` to authorize access to a resource.
 * Rules:
 *  - required: ['read', 'write']: 'read' AND 'write' required;
 *  - required: [['read'], ['write']]: 'read' OR 'write' required;
 *
 * @param permissions: permission scopes
 * @param required: array of scopes to check
 */
export const hasAccess = (permissions: string[], required: string[] | string[][]) => {
  let scopes: string[][];

  if (isArray(required) && required.every(isString)) {
    scopes = [<string[]>required];
  } else {
    scopes = <string[][]>required;
  }

  return scopes.some((required: string[]) => {
    return required.every((permission: string) => {
      return permissions.includes(permission);
    });
  });
};

/**
 * Extract and group scopes/permissions/roles by primary group (org).
 * @param scopes
 */
export const mapAuthzScopes = (scopes: string[]): { [key: string]: string[] } => {
  return scopes.reduce((acc, perm) => {
    const [org, ...scope] = perm.split(':');
    acc[org] = get(acc, org, []).concat([scope.join(':')]);
    return acc;
  }, {});
};

/**
 * Remove nested groups (children) from groups.
 * Nested groups are prefixed with the group label.
 * @param groups
 */
export const removeNestedGroups = (groups: string[]): string[] => {
  if (groups.length) {
    return groups.filter((group: string) => {
      return groups.filter((g: string) => g.includes(group)).length >= 2;
    });
  }
  return [];
};

export const isValidOrg = (orgsFromToken: string[], org: string): boolean =>
  orgsFromToken.includes(org);
