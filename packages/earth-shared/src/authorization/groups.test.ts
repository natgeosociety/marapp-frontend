import { removeNestedGroups, isValidGroup } from './groups';

describe('Groups', () => {
  const groups = [
    'MARAPP',
    'MARAPP-PUBLIC',
    'MARAPP-VIEWER',
    'MARAPP-EDITOR',
    'MARAPP-ADMIN',
    'MARAPP-OWNER',
    'TEST',
    'TEST-PUBLIC',
    'TEST-VIEWER',
    'TEST-EDITOR',
    'TEST-ADMIN',
    'TEST-OWNER',
  ];

  test('should remove nested groups from primary groups', () => {
    const primary = removeNestedGroups(groups);
    expect(primary).toEqual(['MARAPP', 'TEST']);
  });

  test('should check if provided group is valid', () => {
    expect(isValidGroup(groups, 'TEST', false)).toBeTruthy();
    expect(isValidGroup(groups, 'OTHER', false)).toBeFalsy();
    expect(isValidGroup(groups, '*', true)).toBeTruthy();
    expect(isValidGroup(groups, '*', false)).toBeFalsy();
  });
});
