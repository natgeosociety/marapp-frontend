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
