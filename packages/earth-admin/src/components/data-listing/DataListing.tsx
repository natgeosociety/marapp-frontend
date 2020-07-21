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
import InfiniteLoader from 'react-window-infinite-loader';

import './styles.scss';
import {LocationContext} from 'utils/contexts';

let items = {};
let requestCache = {};


const LOADING = 1;
const LOADED = 2;
let itemStatusMap = {};

const isItemLoaded = index => !!itemStatusMap[index];


// class Row extends PureComponent {
//   render() {
//     // @ts-ignore
//     const {index, style} = this.props;
//
//
//     return (
//       <div className="ListItem" style={style}>
//         {`Row ${index}`}
//       </div>
//     );
//   }
// }


function DataListing() {
  const {handleCursorChange, locations} = useContext(LocationContext);

  const [coco, setCoco] = useState(locations);

  const row = ({index}) => {
    return <div className="ListItem">
      {coco[index]? coco[index].name : 'loading'}
    </div>
  }

  const loadMoreItems = (startIndex, stopIndex) => {
    for (let index = startIndex; index <= stopIndex; index++) {
      itemStatusMap[index] = LOADING;
    }

    return handleCursorChange().then(res => {
      for (let index = startIndex; index <= stopIndex; index++) {
        itemStatusMap[index] = LOADED;
      }

      setCoco([...coco, ...res.data]);
      return coco;
    });
  };

  return (
    <div style={{height: '600px'}}>
      {!!coco && <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={1000}
        loadMoreItems={loadMoreItems}
      >
        {({onItemsRendered, ref}) => (
          <List
            className="List"
            height={500}
            minimumBatchSize={20}
            itemCount={1000}
            itemSize={20}
            threshold={15}
            onItemsRendered={onItemsRendered}
            ref={ref}
            width={300}
          >
            {row}
          </List>
        )}
      </InfiniteLoader>}
    </div>
  );
};

export default DataListing;
