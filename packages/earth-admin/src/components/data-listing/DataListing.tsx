/*
  Copyright 2018-2020 National Geographic Society

  Use of this software does not constitute endorsement by National Geographic
  Society (NGS). The NGS name and NGS logo may not be used for any purpose without
  written permission from NGS.

  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at

      https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed
  under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
  CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

import * as React from 'react';
import {useCallback, useContext, useEffect, useMemo, useState} from 'react';

import {createRef, Fragment, PureComponent} from 'react';

// import {FixedSizeList as List} from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

import List from '@researchgate/react-intersection-list';

import './styles.scss';
import {LocationContext} from 'utils/contexts';

// const ExampleWrapper = React.memo(function ExampleWrapper(props: { loading: boolean, hasNextPage: boolean, items: any[], loadNextPage: any }) {
const DataListing = (props) => {
  const {handleCursorChange, locations, isLoading, isNoMore} = useContext(LocationContext);

  const PAGE_SIZE = 20;
  const hasNextPage = locations.length >= PAGE_SIZE;

  let awaitMore = !isLoading && hasNextPage;


  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems([...items, ...locations]);
  }, [locations]);


  useEffect(() => {

  }, [items]);

  const renderItem = (index) => {
    const {slug, id, type, name,} = items[index];
    return (
      <div key={index}>{name}</div>
    );
  };


  const onIntersection = (size, pageSize) => {
    handleCursorChange();
  };

  return <div style={{height: '400px', overflow: 'scroll'}}>
    <List
      awaitMore={awaitMore}
      pageSize={PAGE_SIZE}
      itemCount={items.length}
      renderItem={renderItem}
      onIntersection={onIntersection}
    /></div>;
};

// const ExampleWrapper = (props: { loading: boolean, hasNextPage: boolean, items: any[], loadNextPage: any }) => {
//
//   // @ts-ignore
//   console.log(props.items, props.loading, 'why rerender');
//   // @ts-ignore
//   const {hasNextPage, items, loadNextPage, loading} = props;
//   const itemCount = hasNextPage ? items.length + 1 : items.length;
//
//   const loadMoreItems = loading ? () => {
//   } : loadNextPage;
//
//   const isItemLoaded = index => !hasNextPage || index < items.length;
//
//   // Render an item or a loading indicator.
//   const Item = ({index, style}) => {
//     let content;
//     if (!isItemLoaded(index)) {
//       content = 'Loading...';
//     } else {
//       content = items[index].name;
//     }
//
//     return <div style={style}>{content}</div>;
//   };
//
//   return !!items && <InfiniteLoader
//     isItemLoaded={isItemLoaded}
//     itemCount={itemCount}
//     loadMoreItems={loadMoreItems}
//   >
//     {({onItemsRendered, ref}) => (
//       <List
//         className="List"
//         height={200}
//         itemCount={itemCount}
//         itemSize={20}
//         treshold={10}
//         onItemsRendered={onItemsRendered}
//         ref={ref}
//         width={300}
//       >
//         {Item}
//       </List>
//     )}
//   </InfiniteLoader>;
// };

//
const ExampleWrapper = React.memo(function ExampleWrapper(props: { loading: boolean, hasNextPage: boolean, items: any[], loadNextPage: any }) {

  // @ts-ignore
  console.log(props.items, props.loading, 'why rerender');
  // @ts-ignore
  const {hasNextPage, items, loadNextPage, loading} = props;
  const itemCount = hasNextPage ? items.length + 1 : items.length;

  const loadMoreItems = loading ? () => {
  } : loadNextPage;

  const isItemLoaded = index => !hasNextPage || index < items.length;

  // Render an item or a loading indicator.
  const Item = ({index, style}) => {
    let content;
    if (!isItemLoaded(index)) {
      content = 'Loading...';
    } else {
      content = items[index].name;
    }

    return <div style={style}>{content}</div>;
  };

  return <InfiniteLoader
    isItemLoaded={isItemLoaded}
    itemCount={itemCount}
    loadMoreItems={loadMoreItems}
  >
    {({onItemsRendered, ref}) => (
      <List
        className="List"
        height={200}
        itemCount={itemCount}
        itemSize={20}
        treshold={10}
        onItemsRendered={onItemsRendered}
        ref={ref}
        width={300}
      >
        {Item}
      </List>
    )}
  </InfiniteLoader>;
});


export default DataListing;
