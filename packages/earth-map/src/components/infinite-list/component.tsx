import List from '@researchgate/react-intersection-list';
import MuiList from '@material-ui/core/List';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { PAGE_SIZE } from 'theme';

import { Spinner } from '@marapp/earth-shared';

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
        <Box p={2} pb={0}>
          <Typography variant="subtitle1">{title}</Typography>
        </Box>
      )}
      <List
        awaitMore={awaitMore}
        pageSize={pageSize}
        itemCount={data.length}
        renderItem={(index) => children(data[index])}
        itemsRenderer={(items, ref) => <MuiList ref={ref}>{items}</MuiList>}
        onIntersection={onIntersection}
      />
      {loading && <Spinner position="relative" />}
    </div>
  );
};

export default InfiniteList;
