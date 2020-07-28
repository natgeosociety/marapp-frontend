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

import List from '@researchgate/react-intersection-list';
import { Spinner } from '@marapp/earth-components';
import { SearchBox } from './search-box';
import { useAuth0 } from 'auth/auth0';

import './styles.scss';


const DataListing = ( props ) => {
  const {
    cursorAction, data, isLoading, isNoMore,
    searchValue, searchValueAction, categoryUrl, pageTitle, childComponent, pageSize, totalResults, selectedItem,
  } = props;
  const { selectedGroup } = useAuth0();

  const PAGE_SIZE = pageSize;
  const hasNextPage = data.length >= PAGE_SIZE;
  let awaitMore = !isLoading && hasNextPage && !isNoMore;

  const renderItem = ( index ) => {
    const item = data[ index ];
    return (
      <div key={index}>
        {React.createElement(childComponent, {
          item: item,
          categoryUrl: categoryUrl,
          selectedItem: selectedItem,
        })}
      </div>
    );
  };

  const onIntersection = ( size, pageSize ) => {
    cursorAction();
  };

  return (<>
    {searchValueAction &&
    <SearchBox searchValue={searchValue} pageTitle={pageTitle} searchValueAction={searchValueAction}/>}
    <div style={{ 'overflowY': 'scroll' }}>
      {!!totalResults && <div
        className="ng-padding-medium-horizontal ng-padding-medium-top ng-padding-bottom ng-background-ultradkgray">
        <h4 className="ng-text-display-s ng-color-ultraltgray ng-margin-remove">{selectedGroup} {pageTitle} &nbsp;
          <span className="ng-color-mdgray">({totalResults})</span></h4>
      </div>}

      <div>
        <List
          awaitMore={awaitMore}
          pageSize={PAGE_SIZE}
          itemCount={data.length}
          renderItem={renderItem}
          onIntersection={onIntersection}
        />
        {isNoMore && (
          <div className=" ng-text-center">
            <p className=" ng-color-gray-3 ng-margin-medium-top ng-margin-bottom-remove">
              - end -
            </p>
          </div>
        )}
      </div>
      {isLoading && <Spinner position="relative"/>}
    </div>
  </>);
};

export default DataListing;
