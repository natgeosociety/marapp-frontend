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

import get from 'lodash/get';
import omitBy from 'lodash/omitBy';
import qs from 'query-string';
import { createSelector } from 'reselect';

const state = (state) => state;
const router = (state) => state.router;

const urlProps = (state, props) => props.urlProps;

export const getUrlFromParams = createSelector([urlProps, state], (_urlProps, _state) => {
  return _urlProps.reduce((acc, current) => {
    const value = get(_state, current.redux);

    return {
      ...acc,
      [current.value]: value,
    };
  }, {});
});

export const getParamsFromUrl = createSelector([urlProps, state], (_urlProps, _state) => {
  return _urlProps.reduce((acc, current) => {
    const { type } = current;
    const { router } = _state;
    const { query = {} } = router;

    const value = query[current.value];

    if (type === 'array') {
      const val = value || [];

      return {
        ...acc,
        [current.value]: Array.isArray(val) ? val : [val],
      };
    }

    return {
      ...acc,
      [current.value]: value,
    };
  }, {});
});

export const getUrl = createSelector(
  [router, urlProps, getUrlFromParams],
  (_router, _urlProps, _urlParams) => {
    const params = omitBy(_urlParams, (value, key) => {
      const { required } = _urlProps.find((up) => up.value === key);
      if (required) {
        return typeof value === 'undefined';
      }

      return !value;
    });

    const { pathname } = _router;
    const query = qs.stringify(params, { arrayFormat: 'comma' });

    return `${pathname}?${query}`;
  }
);

export default { getUrl };
