import {
  isSuperAdmin,
  isAuthz,
  isAdminAuthz,
  mapRoleGroups,
  mapAuthorizedRoleGroups,
  getPrivateGroups,
  getPublicGroups,
  RoleEnum,
} from './roles';

describe('Roles', () => {
  const roles = [
    'MARAPP:Public',
    'MARAPP:Viewer',
    'MARAPP:Editor',
    'MARAPP:Admin',
    'MARAPP:Owner',
    'TEST:Public',
    'TEST:Viewer',
    'TEST:Editor',
    'TEST:Admin',
    'TEST:Owner',
  ];
  const extended = [...roles, '*:SuperAdmin'];

  test('should check if roles include super admin role', () => {
    expect(isSuperAdmin(roles)).toBeFalsy();
    expect(isSuperAdmin(extended)).toBeTruthy();
  });

  test('should check if authorized for non-admin access', () => {
    expect(isAuthz(['MARAPP:Public'])).toBeTruthy();
    expect(isAuthz(['MARAPP:Viewer'])).toBeTruthy();
    expect(isAuthz(['MARAPP:Editor'])).toBeTruthy();
    expect(isAuthz(['MARAPP:Admin'])).toBeTruthy();
    expect(isAuthz(['MARAPP:Owner'])).toBeTruthy();
  });

  test('should check if authorized for admin access', () => {
    expect(isAdminAuthz(['MARAPP:Public'])).toBeFalsy();
    expect(isAdminAuthz(['MARAPP:Viewer'])).toBeFalsy();
    expect(isAdminAuthz(['MARAPP:Editor'])).toBeTruthy();
    expect(isAdminAuthz(['MARAPP:Admin'])).toBeTruthy();
    expect(isAdminAuthz(['MARAPP:Owner'])).toBeTruthy();
  });

  test('should create a group mapping from roles', () => {
    expect(mapRoleGroups(roles)).toEqual(['MARAPP', 'TEST']);
    expect(mapRoleGroups(extended)).toEqual(['MARAPP', 'TEST', '*']);
  });

  test('should create a group mapping from authorized roles', () => {
    expect(mapAuthorizedRoleGroups(['MARAPP:Public'])).toEqual([]);
    expect(mapAuthorizedRoleGroups(['MARAPP:Viewer'])).toEqual([]);
    expect(mapAuthorizedRoleGroups(['MARAPP:Editor'])).toEqual(['MARAPP']);
    expect(mapAuthorizedRoleGroups(['MARAPP:Admin'])).toEqual(['MARAPP']);
    expect(mapAuthorizedRoleGroups(['MARAPP:Owner'])).toEqual(['MARAPP']);
    expect(mapAuthorizedRoleGroups(['MARAPP:Public', 'TEST:Admin'])).toEqual(['TEST']);
    expect(mapAuthorizedRoleGroups(['MARAPP:Viewer', 'TEST:Owner'])).toEqual(['TEST']);
  });

  test('getPrivateGroups() should return groups where role is above VIEWER', () => {
    const onlyPublic = {
      MARAPP: [RoleEnum.PUBLIC],
    };
    const publicAndPrivate = {
      ...onlyPublic,
      NGS: [RoleEnum.EDITOR],
    };
    const withSuperAdmin = {
      ...publicAndPrivate,
      '*': [RoleEnum.SUPER_ADMIN],
    };
    const withMultipleRoles = {
      ...onlyPublic,
      NGS: [RoleEnum.PUBLIC, RoleEnum.ADMIN],
    };
    expect(getPrivateGroups(onlyPublic)).toEqual([]);
    expect(getPrivateGroups(publicAndPrivate)).toEqual(['NGS']);
    expect(getPrivateGroups(withSuperAdmin)).toEqual(['NGS']);
    expect(getPrivateGroups(withMultipleRoles)).toEqual(['NGS']);
  });

  test('getPublicGroups() should return groups that have PUBLIC role', () => {
    const groupsWithRoles = {
      MARAPP: [RoleEnum.PUBLIC],
      TEST1: [RoleEnum.EDITOR],
      TEST2: [RoleEnum.ADMIN],
      TEST3: [RoleEnum.OWNER, RoleEnum.PUBLIC],
      '*': [RoleEnum.SUPER_ADMIN],
    };
    expect(getPublicGroups(groupsWithRoles)).toEqual(['MARAPP', 'TEST3']);
  });
});
