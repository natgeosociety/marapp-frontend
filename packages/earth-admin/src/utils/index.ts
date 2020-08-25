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

import { navigate } from 'gatsby';
import { BASE_URL } from 'config';
import { ADMIN_PAGES } from 'components/sidebar-select/model';
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
import { childOfKind } from 'tslint';

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
export const encodeQueryToURL = (baseUrl: string, query: {[key: string]: any} = {}): string =>
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
  if (!Array.isArray(permissions)) {
    return false;
  }

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
export const mapAuthzScopes = (scopes: string[]): {[key: string]: string[]} => {
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

export const setPage = (pageType: string) => {
  return ADMIN_PAGES.filter((page) => page.key === pageType);
};

/**
 * Get available organizations based on permissions
 * @param permissions
 */
export const getAvailableOrgs = (permissions: {[key: string]: string}): string[] => {
  const specialPermissions = [
    '*', // super-admin
  ];

  return Object.keys(permissions).filter((permission) => !specialPermissions.includes(permission));
};

/**
 * Convert km2 to ha
 * @param value
 */
export const km2toHa = (value: number): number => {
  return value * 100;
};

const PARENTHESES_TYPE = {
  rounded: {first: '(', last: ')'},
  brackets: {first: '[', last: ']'},
};
/**
 * Takes an array and formats it to a string surrounded by parentheses
 * @param array
 * @param parenthesesType - type or parentheses, maps to PARENTHESES_TYPE
 * @param formatNo - how many parentheses groups
 */

export const formatArrayToParentheses = (array: string, parenthesesType: string, formatNo: number): string => {
  const {first, last} = PARENTHESES_TYPE[parenthesesType];

  if (formatNo === 1) {
    return `${first}${array.toString()}${last}`;
  }
  if (formatNo === 2) {
    return `${first}${array.slice(0, 2).toString()}${last} ,${first}${array.slice(2, 4)}${last}`;
  }
};


export const downloadFile = (data) => {
  const stringifiedMetric = JSON.stringify(data);
  const jsonBlob = new Blob([stringifiedMetric]);
  const blobUrl = URL.createObjectURL(jsonBlob);
  return blobUrl;
}
