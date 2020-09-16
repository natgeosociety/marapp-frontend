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

import { ADMIN_PAGES } from 'components/sidebar-select/model';
import { BASE_URL } from 'config';
import { navigate } from 'gatsby';
import moment from 'moment';
import queryStringEncode from 'query-string-encode';
import { RefObject } from 'react';

const JSONAPIDeserializer = require('ts-jsonapi').Deserializer;

const DeserializerService = new JSONAPIDeserializer({
  keyForAttribute: (attribute: any) => {
    return attribute;
  },
});

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
export const encodeQueryToURL = (baseUrl: string, query: { [key: string]: any } = {}): string =>
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

export const setPage = (pageType: string) => {
  return ADMIN_PAGES.filter((page) => page.key === pageType);
};

/**
 * Convert km2 to ha
 * @param value
 */
export const km2toHa = (value: number): number => {
  return value * 100;
};

const PARENTHESES_TYPE = {
  rounded: { first: '(', last: ')' },
  brackets: { first: '[', last: ']' },
};

/**
 * Takes an array and formats it to a string surrounded by parentheses
 * @param array
 * @param parenthesesType - type or parentheses, maps to PARENTHESES_TYPE
 * @param formatNo - how many parentheses groups
 */
export const formatArrayToParentheses = (
  array: string,
  parenthesesType: string,
  formatNo: number
): string => {
  const { first, last } = PARENTHESES_TYPE[parenthesesType];

  if (formatNo === 1) {
    return `${first}${array.toString()}${last}`;
  }
  if (formatNo === 2) {
    return `${first}${array.slice(0, 2).toString()}${last} ,${first}${array.slice(2, 4)}${last}`;
  }
};

export const downloadFile = (data): string => {
  const encoded = JSON.stringify(data);
  const jsonBlob = new Blob([encoded]);
  return URL.createObjectURL(jsonBlob);
};

/**
 * Flattens object array returned from multiselect to work with api
 * @param data
 * @param fieldName
 */
export const flattenArrayForSelect = (data: Array<{}>, fieldName: string): string[] => {
  return !!data ? data.map((val) => val[fieldName]) : data;
};

/**
 * Flattens object returned from single select to work with the APIs
 * @param data
 * @param fieldName
 */
export const flattenObjectForSelect = (data: {}, fieldName: string): string => {
  return !!data ? data[fieldName] : data;
};

/**
 * Sets up object needed for multiselect based on value returned from APIs
 * @param options
 * @param values
 */
export const getSelectValues = (
  options: Array<{ value: string }>,
  values
): Array<{ value: string }> => {
  const temp = [];
  values.map((value) => temp.push(options.find((val) => val.value === value)));

  return temp;
};

/**
 * Copy to clipboard function
 * @param e
 * @param ref
 * @param successFunction
 */
export function copyToClipboard(
  e: Event,
  ref: RefObject<any>,
  successFunction: (value: string) => void
): void {
  e.preventDefault();
  ref.current.select();

  document.execCommand('copy');

  successFunction('Copied!');

  setTimeout(() => {
    successFunction('');
  }, 4000);
}
