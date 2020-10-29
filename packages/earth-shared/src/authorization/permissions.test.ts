import { hasAccess, mapAuthzScopes } from './permissions';

describe('Permissions', () => {
  const permissions = [
    'MARAPP:read:*',
    'MARAPP:write:*',
    'MARAPP:read:locations',
    'MARAPP:write:locations',
    'MARAPP:read:metrics',
    'MARAPP:write:metrics',
    'MARAPP:read:collections',
    'MARAPP:write:collections',
    'MARAPP:read:layers',
    'MARAPP:write:layers',
    'MARAPP:read:widgets',
    'MARAPP:write:widgets',
    'MARAPP:read:dashboards',
    'MARAPP:write:dashboards',
    'MARAPP:read:users',
    'MARAPP:write:users',
    'MARAPP:read:organizations',
    'MARAPP:write:organizations',
    'MARAPP:read:stats',
    'TEST:read:*',
    'TEST:write:*',
    'TEST:read:locations',
    'TEST:write:locations',
    'TEST:read:metrics',
    'TEST:write:metrics',
    'TEST:read:collections',
    'TEST:write:collections',
    'TEST:read:layers',
    'TEST:write:layers',
    'TEST:read:widgets',
    'TEST:write:widgets',
    'TEST:read:dashboards',
    'TEST:write:dashboards',
    'TEST:read:users',
    'TEST:write:users',
    'TEST:read:organizations',
    'TEST:write:organizations',
    'TEST:read:stats',
  ];

  test('should map permissions based on primary groups', () => {
    const expected = {
      MARAPP: [
        'read:*',
        'write:*',
        'read:locations',
        'write:locations',
        'read:metrics',
        'write:metrics',
        'read:collections',
        'write:collections',
        'read:layers',
        'write:layers',
        'read:widgets',
        'write:widgets',
        'read:dashboards',
        'write:dashboards',
        'read:users',
        'write:users',
        'read:organizations',
        'write:organizations',
        'read:stats',
      ],
      TEST: [
        'read:*',
        'write:*',
        'read:locations',
        'write:locations',
        'read:metrics',
        'write:metrics',
        'read:collections',
        'write:collections',
        'read:layers',
        'write:layers',
        'read:widgets',
        'write:widgets',
        'read:dashboards',
        'write:dashboards',
        'read:users',
        'write:users',
        'read:organizations',
        'write:organizations',
        'read:stats',
      ],
    };
    expect(mapAuthzScopes(permissions)).toEqual(expected);
  });

  test('should check for access based on permissions (OR)', () => {
    expect(hasAccess(['read'], [['read'], ['read:*']])).toBeTruthy();
    expect(hasAccess(['read:*'], [['read'], ['read:*']])).toBeTruthy();
    expect(hasAccess(['write'], [['read'], ['read:*']])).toBeFalsy();
    expect(hasAccess(['read:locations'], [['read:locations'], ['read:*']])).toBeTruthy();
    expect(hasAccess(['read:*'], [['read:locations'], ['read:*']])).toBeTruthy();
    expect(hasAccess(['write:location'], [['read:locations'], ['read:*']])).toBeFalsy();
  });

  test('should check for access based on permissions (AND)', () => {
    expect(hasAccess(['read'], ['read', 'write'])).toBeFalsy();
    expect(hasAccess(['write'], ['read', 'write'])).toBeFalsy();
    expect(hasAccess(['read', 'write'], ['read', 'write'])).toBeTruthy();
    expect(hasAccess(['read:*'], ['read:*', 'write:*'])).toBeFalsy();
    expect(hasAccess(['write:*'], ['read:*', 'write:*'])).toBeFalsy();
    expect(hasAccess(['read:*', 'write:*'], ['read:*', 'write:*'])).toBeTruthy();
  });
});
