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

import React from 'react';

import urljoin from 'url-join';
import get from 'lodash/get';

const BASE_URL = process.env.REACT_APP_BASE_URL || '/';

/**
 * Route to target URL in case of success/failure.
 */

export const routeToPage = ({
  basePath,
  targetPath,
}: {
  basePath?: string;
  targetPath?: string;
}) => {
  const base = basePath ? basePath : BASE_URL;
  const target = targetPath ? urljoin(base, targetPath) : base;

  window.history.replaceState({}, document.title, target);
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

/**
 *  Returns true if user has permission to
 *  view admin link
 */
const ADMIN_ROLE_TYPES = ['Admin', 'Editor'];

export const checkRole = (roles: string[]) => roles.some((role) => ADMIN_ROLE_TYPES.includes(role));

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

export const isValidOrg = (orgsFromToken: string[], org: string): boolean =>
  orgsFromToken.includes(org);

export const parseHintBold = (text: string = '') => {
  return text.split(/({{.+?}})/).map(term => (
    term.startsWith('{{') && term.endsWith('}}')
      ? (
        <b className="ng-text-weight-bold">
          {term.replace('{{', '').replace('}}', '')}
        </b>
      )
      : term
  ))
};
