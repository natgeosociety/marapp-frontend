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

import chroma from 'chroma-js';

export const formatKM2 = (v) => {
  switch (true) {
    case v < 0.01: {
      return ',.4~f';
    }

    case v < 1: {
      return ',.3~f';
    }

    case v < 10: {
      return ',.2~f';
    }

    case v < 100: {
      return ',.1~f';
    }

    default: {
      return ',.0~f';
    }
  }
};

export const formatPercentage = (v) => {
  switch (true) {
    case v < 0.01: {
      return ',.3~%';
    }

    default: {
      return ',.2~%';
    }
  }
};

export const stringOrHtml = (originalStr, props) => {
  let str = originalStr;
  const { className } = props;

  if (className) {
    str = `<span class="${className}">${str}</span>`;
  }

  return str;
};

/**
 * Params should have this format => { key:'xxx', key2:'xxx' }
 * Keys to search should be in this format {{key}}
 * @param {String} originalStr
 * @param {Object} params
 */
export const substitution = (originalStr, params = {}, options = {}) => {
  let str = originalStr;
  Object.keys(params).forEach((key) => {
    const p = stringOrHtml(params[key], options);

    str = str.replace(new RegExp(`{{${key}}}`, 'g'), p).replace(new RegExp(`{${key}}`, 'g'), p);
  });
  return str;
};

/**
 * Replace function
 * @param {String} string
 * @param {Object} params
 * @param {Object} sqlParams
 */
export const replace = (originalStr, params = {}, sqlParams = {}, options = {}) => {
  let str = originalStr;

  if (typeof str === 'string') {
    str = substitution(str, params, options);
  }

  return str;
};

export const getColorFromPallete = (pattern, value, alpha = 1) => {
  const domain = [];
  const colors = [];

  pattern.forEach((p) => {
    colors.push(p.color);
    domain.push(p.quantity);
  });

  const ChromaScale = chroma.scale(colors).domain(domain);

  return ChromaScale(value).hex('rgb');
};

export default { substitution, replace, getColorFromPallete };
