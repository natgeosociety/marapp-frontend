import { removeNestedGroups } from './groups';

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
});
