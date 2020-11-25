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
import queryStringEncode from 'query-string-encode';
import flatten from 'flat';
import { Parser } from 'json2csv';
import { last } from 'lodash';

/**
 * Serialize filters in the format
 *   filter=type==Continent;Jurisdiction,featured==true
 *   note: each group of values is encoded, including valueSeparator
 */
export const serializeFilters = (filters, filterSep = ',', valueSep = ';') => {
  return Object.keys(filters).reduce((acc, key) => {
    const filterGroup = filters[key];
    const value = Array.isArray(filterGroup) ? filterGroup.join(valueSep) : filterGroup;
    const encodedFilters = [`${key}==${encodeURIComponent(value)}`, acc]
      .filter((e) => !!e)
      .join(filterSep);

    return encodedFilters;
  }, '');
};

/**
 * Url encode
 */
export const encodeQueryToURL = (baseUrl, query) =>
  [baseUrl, decodeURIComponent(queryStringEncode(query))].join('?');

/**
 * Download json file
 * @param data
 * @returns {string}
 */
export const downloadJSONFile = (data) => {
  const encoded = JSON.stringify(data);
  const jsonBlob = new Blob([encoded]);
  return URL.createObjectURL(jsonBlob);
};

/**
 * Downalod csv file
 * @param data
 */
export const downloadCSVFile = (data) => {
  const json2csvParser = new Parser();
  const csv = json2csvParser.parse(flatten(data));
  const csvBlob = new Blob([csv]);
  return URL.createObjectURL(csvBlob);
};

/**
 * Generic way of rendering a date in our apps YYYY-MM-DD
 */
export const getGenericDate = (date: string): string => {
  const parsed = new Date(date);
  // getMonth() is zero based
  const month = parsed.getMonth() + 1;

  return `${parsed.getFullYear()}-${month}-${parsed.getDate()}`;
};

/**
 * Get initials from user name
 */
export const getInitials = (name: string): string => {
  const emptySpace = ' ';
  const [firstName = emptySpace, ...rest] = name.split(emptySpace);
  const lastName = last(rest) || emptySpace;

  return `${firstName[0]}${lastName[0]}`.toUpperCase();
};
