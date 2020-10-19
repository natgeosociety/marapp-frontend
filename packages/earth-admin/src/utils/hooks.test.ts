import { mergePages } from './hooks';

describe('Hooks', () => {
  test('mergePages()', () => {
    const separatePages = [
      {
        data: [1, 2, 3],
        total: 90,
      },
      {
        data: [3, 4],
        total: 90,
      },
    ];

    const mergedPages = mergePages(separatePages);
    expect(mergedPages.data.length).toBe(5);
    expect(mergedPages.total).toBe(90);
  });
});
