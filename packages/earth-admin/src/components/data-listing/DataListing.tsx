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
import {useContext, useEffect, useState} from 'react';

import {createRef, Fragment, PureComponent} from 'react';

import {FixedSizeList as List} from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';

import './styles.scss';
import {LocationContext} from 'utils/contexts';

let items = {};
let requestCache = {};

const Row = ({index, style}) => {
  const item = items[index];

  return (
    <div style={style}>
      {item ? `${item.name}` : 'Loading...'}
    </div>
  );
};

const isItemLoaded = ({index}) => !!items[index];


const DataListing = () => {
  const {handleCursorChange, locations} = useContext(LocationContext);

  const [coco, setCoco] = useState([]);
  const [index1, setIndex1] = useState(null);




  const loadMoreItems = (visibleStartIndex, visibleStopIndex) => {

    const key = [visibleStartIndex, visibleStopIndex].join(':'); // 0:10
    if (requestCache[key]) {
      return;
    }

    const length = visibleStopIndex - visibleStartIndex;
    const visibleRange = [...Array(length).keys()].map(
      x => x + visibleStartIndex
    );

    const itemsRetrieved = visibleRange.every(index => !!items[index]);

    if (itemsRetrieved) {
      requestCache[key] = key;
      return;
    }


    console.log(locations);

    return new Promise((resolve, reject) => {
      console.log('dece ');
      handleCursorChange();

      locations.forEach((location, index) => {
        items[index + visibleStartIndex] = location;
      })
      resolve();
    })
  };


  return (
    <div style={{height: '600px'}}>
      <AutoSizer defaultHeight={500}>
        {({height, width}) => (
          <InfiniteLoader
            isItemLoaded={isItemLoaded}
            loadMoreItems={loadMoreItems}
            itemCount={1000}
          >
            {({onItemsRendered, ref}) => (
              <List
                className="List"
                height={height}
                itemCount={1000}
                itemSize={35}
                width={width}
                ref={ref}
                onItemsRendered={onItemsRendered}
              >
                {Row}
              </List>
            )}
          </InfiniteLoader>
        )}
      </AutoSizer></div>
  );
};

export default DataListing;
