import { Spinner } from '@marapp/earth-shared';
import List from '@researchgate/react-intersection-list';
import React from 'react';
import { PAGE_SIZE } from 'theme';

interface IProps {
  data: any[];
  loading: boolean;
  nextPageCursor: string;
  children: (item: any) => React.ReactElement;
  onNextPage: (config: any) => void;
  pageSize?: number;
  title?: string;
}

const InfiniteList = (props: IProps) => {
  const {
    data,
    loading,
    pageSize = PAGE_SIZE,
    nextPageCursor,
    children,
    onNextPage,
    title,
  } = props;
  const awaitMore = !loading && !!nextPageCursor;

  const onIntersection = (size, pageSize) => {
    if (!awaitMore) {
      return;
    }
    onNextPage({
      pageCursor: nextPageCursor,
      pageSize,
    });
  };

  return (
    <div className="marapp-qa-infinitelist ng-section-background ng-position-relative ng-padding-medium-bottom">
      {title && (
        <h2 className="ng-padding-small-bottom ng-padding-medium-horizontal ng-padding-medium-top ng-text-display-s ng-body-color ng-margin-remove">
          {title}
        </h2>
      )}
      <List
        awaitMore={awaitMore}
        pageSize={pageSize}
        itemCount={data.length}
        renderItem={(index) => children(data[index])}
        onIntersection={onIntersection}
      />
      {loading && <Spinner position="relative" />}
    </div>
  );
};

export default InfiniteList;
