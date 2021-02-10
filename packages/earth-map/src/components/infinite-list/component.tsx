import List from '@researchgate/react-intersection-list';
import MuiList from '@material-ui/core/List';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { Spinner } from '@marapp/earth-shared';

import { PAGE_SIZE } from '../../theme';

interface IProps {
  data: any[];
  isValidating: boolean;
  awaitMore: boolean;
  children: (item: any) => React.ReactElement;
  onNextPage: (config: any) => void;
  pageSize?: number;
  title?: string;
}

const InfiniteList = (props: IProps) => {
  const {
    data,
    isValidating,
    awaitMore,
    pageSize = PAGE_SIZE,
    children,
    onNextPage,
    title,
  } = props;

  if (!data) {
    return <Spinner position="relative" />;
  }

  return (
    <div className="marapp-qa-infinitelist">
      {title && (
        <Box p={2} pb={0}>
          <Typography variant="subtitle2" color="textSecondary">
            {title}
          </Typography>
        </Box>
      )}
      <List
        awaitMore={awaitMore}
        pageSize={pageSize}
        itemCount={data.length}
        renderItem={(index) => children(data[index])}
        itemsRenderer={(items, ref) => <MuiList ref={ref}>{items}</MuiList>}
        onIntersection={onNextPage}
      />
      {isValidating && <Spinner position="relative" />}
    </div>
  );
};

export default InfiniteList;
