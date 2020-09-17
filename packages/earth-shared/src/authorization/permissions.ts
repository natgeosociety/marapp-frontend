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
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';

enum ScopesEnum {
  ReadAll = 'read:*',
  WriteAll = 'write:*',
  ReadLocations = 'read:locations',
  WriteLocations = 'write:locations',
  ReadMetrics = 'read:metrics',
  WriteMetrics = 'write:metrics',
  ReadCollections = 'read:collections',
  WriteCollections = 'write:collections',
  ReadLayers = 'read:layers',
  WriteLayers = 'write:layers',
  ReadWidgets = 'read:widgets',
  WriteWidgets = 'write:widgets',
  ReadDashboards = 'read:dashboards',
  WriteDashboards = 'write:dashboards',
  ReadUsers = 'read:users',
  WriteUsers = 'write:users',
  ReadOrganizations = 'read:organizations',
  WriteOrganizations = 'write:organizations',
  ReadStats = 'read:stats',
}

export const AuthzGuards = {
  readAllGuard: [ScopesEnum.ReadAll],
  writeAllGuard: [ScopesEnum.WriteAll],
  readPlacesGuard: [[ScopesEnum.ReadLocations], [ScopesEnum.ReadAll]],
  writePlacesGuard: [[ScopesEnum.WriteLocations], [ScopesEnum.WriteAll]],
  accessHomeGuard: [[ScopesEnum.ReadAll], [ScopesEnum.ReadStats]],
  accessPlacesGuard: [
    [ScopesEnum.ReadLocations],
    [ScopesEnum.ReadAll],
    [ScopesEnum.WriteLocations],
    [ScopesEnum.WriteAll],
  ],
  readMetricsGuard: [[ScopesEnum.ReadMetrics], [ScopesEnum.ReadAll]],
  writeMetricsGuard: [[ScopesEnum.WriteMetrics], [ScopesEnum.WriteAll]],
  accessMetricsGuard: [
    [ScopesEnum.ReadMetrics],
    [ScopesEnum.ReadAll],
    [ScopesEnum.WriteMetrics],
    [ScopesEnum.WriteAll],
  ],
  readCollectionsGuard: [[ScopesEnum.ReadCollections], [ScopesEnum.ReadAll]],
  writeCollectionsGuard: [[ScopesEnum.WriteCollections], [ScopesEnum.WriteAll]],
  accessCollectionsGuard: [
    [ScopesEnum.ReadCollections],
    [ScopesEnum.ReadAll],
    [ScopesEnum.WriteCollections],
    [ScopesEnum.WriteAll],
  ],
  readLayersGuard: [[ScopesEnum.ReadLayers], [ScopesEnum.ReadAll]],
  writeLayersGuard: [[ScopesEnum.WriteLayers], [ScopesEnum.WriteAll]],
  accessLayersGuard: [
    [ScopesEnum.ReadLayers],
    [ScopesEnum.ReadAll],
    [ScopesEnum.WriteLayers],
    [ScopesEnum.WriteAll],
  ],
  readWidgetsGuard: [[ScopesEnum.ReadWidgets], [ScopesEnum.ReadAll]],
  writeWidgetsGuard: [[ScopesEnum.WriteWidgets], [ScopesEnum.WriteAll]],
  accessWidgetsGuard: [
    [ScopesEnum.ReadWidgets],
    [ScopesEnum.ReadAll],
    [ScopesEnum.WriteWidgets],
    [ScopesEnum.WriteAll],
  ],
  readWDashboardsGuard: [[ScopesEnum.ReadDashboards], [ScopesEnum.ReadAll]],
  writeDashboardsGuard: [[ScopesEnum.WriteDashboards], [ScopesEnum.WriteAll]],
  accessDashboardsGuard: [
    [ScopesEnum.ReadDashboards],
    [ScopesEnum.ReadAll],
    [ScopesEnum.WriteDashboards],
    [ScopesEnum.WriteAll],
  ],
  readUsersGuard: [[ScopesEnum.ReadUsers], [ScopesEnum.ReadAll]],
  writeUsersGuard: [[ScopesEnum.WriteUsers], [ScopesEnum.WriteAll]],
  accessUsersGuard: [
    [ScopesEnum.ReadUsers],
    [ScopesEnum.ReadAll],
    [ScopesEnum.WriteUsers],
    [ScopesEnum.WriteAll],
  ],
  accessOrganizationsGuard: [[ScopesEnum.ReadOrganizations], [ScopesEnum.WriteOrganizations]],
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
export const mapAuthzScopes = (scopes: string[]): { [key: string]: string[] } => {
  return scopes.reduce((acc, perm) => {
    const [org, ...scope] = perm.split(':');
    acc[org] = get(acc, org, []).concat([scope.join(':')]);
    return acc;
  }, {});
};
