import { renderHook, act } from '@testing-library/react-hooks';

import { mergePages, useInfiniteList } from './hooks';

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

  test('useInfiniteList() hook', async () => {
    const nextCursor = 'xxyyzz';
    const getQuery = jest.fn().mockImplementation((cursor) => {
      return `/something?cursor=${cursor}`;
    });
    const fetcher = async (url) => {
      return {
        data: [{}, {}, {}],
        pagination: {
          nextCursor,
        },
        total: 200,
      };
    };

    const { result, waitForNextUpdate, rerender } = renderHook(() =>
      useInfiniteList(getQuery, fetcher)
    );
    const {
      current: { listProps },
    } = result;

    await waitForNextUpdate();

    expect(listProps.data.length).toBe(0);
    expect(getQuery).toHaveBeenCalled();

    // TODO: finish test implementation
  });
});
