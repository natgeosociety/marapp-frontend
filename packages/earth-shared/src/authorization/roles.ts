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

enum RoleEnum {
  PUBLIC = 'Public',
  VIEWER = 'Viewer',
  EDITOR = 'Editor',
  ADMIN = 'Admin',
  OWNER = 'Owner',
  SUPER_ADMIN = 'SuperAdmin',
}

/**
 * Is Super-Admin if special permission '*:SuperAdmin' present.
 * @param roles
 * @param sep
 */
export const isSuperAdmin = (roles: string[] & object, sep: string = ':'): boolean => {
  return Array.isArray(roles)
    ? !!roles.find((r: string) => r === ['*', RoleEnum.SUPER_ADMIN].join(sep))
    : !!roles && !!roles['*'];
};

/**
 * Authorized if any role present.
 * @param roles
 */
export const isAuthz = (roles: string[]): boolean => {
  return roles && roles.length > 0;
};

/**
 * Authorized if any role except 'Viewer' present.
 * @param roles
 * @param sep
 */
export const isAdminAuthz = (roles: string[], sep: string = ':'): boolean => {
  return !!roles.find(
    (r: string) => ![RoleEnum.PUBLIC, RoleEnum.VIEWER].includes(<any>r.split(sep)[1])
  );
};

/**
 * Map groups from existing roles.
 * @param roles
 * @param excludeGroups
 * @param sep
 */
export const mapRoleGroups = (
  roles: string[],
  excludeGroups: string[] = [],
  sep: string = ':'
): string[] => {
  const groups = roles
    .map((r: string) => r.split(sep)[0])
    .filter((g: string) => !excludeGroups.includes(g));
  return Array.from(new Set(groups));
};

/**
 * Map groups from existing roles.
 * Group isAuthorized if any role except 'Viewer' present.
 * @param roles
 * @param excludeGroups
 * @param sep
 */
export const mapAuthorizedRoleGroups = (
  roles: string[],
  excludeGroups: string[] = [],
  sep: string = ':'
): string[] => {
  const groups = roles
    .filter((r: string) => ![RoleEnum.PUBLIC, RoleEnum.VIEWER].includes(<any>r.split(sep)[1]))
    .map((r: string) => r.split(sep)[0])
    .filter((g: string) => !excludeGroups.includes(g));
  return Array.from(new Set(groups));
};

/**
 *  Returns true if user has permission to view admin link.
 */
export const checkRole = (roles: string[]): boolean => {
  const exceptViewer: string[] = Object.values(RoleEnum).filter(
    (r) => ![RoleEnum.PUBLIC, RoleEnum.VIEWER].includes(r)
  );
  return roles.some((r: string) => exceptViewer.includes(r));
};
