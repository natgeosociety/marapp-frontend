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

/**
 * Serialize filters in the format
 *   filter=type==Continent|Jurisdiction,featured==true
 * @param filters
 * @param filterSep
 * @param valueSep
 */
export const serializeFilters = (
  filters: IFilters,
  filterSep: string = ',',
  valueSep: string = '|'
): string => {
  return Object.keys(filters).reduce((acc, key) => {
    const filterGroup = filters[key];
    return `${key}==${filterGroup.join(valueSep)}${filterSep}${acc}`;
  }, ``);
};

/**
 * Check if filters contain any values
 */
export const hasFilters = (filters: IFilters): boolean => {
  return countFilters(filters) !== 0;
};

/**
 * Count the number of selected filters
 */
export const countFilters = (filters: IFilters): number => {
  return Object.keys(filters).reduce((acc, current) => {
    const val = filters[current];
    return acc + val.length;
  }, 0);
};

/**
 * Strips keys that have empty arrays
 */
export const cleanFilters = (filters: IFilters): IFilters => {
  return Object.keys(filters)
    .filter((key) => filters[key].length)
    .reduce((acc, key) => {
      acc[key] = filters[key];
      return acc;
    }, {});
};

export interface IFilters {
  [key: string]: string[] | boolean[];
}
