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
import classnames from 'classnames';

import List from '@researchgate/react-intersection-list';
import {Spinner} from '@marapp/earth-components';

import './styles.scss';
import {useState} from 'react';

const DataListing = (props) => {
  const {cursorAction, data, isLoading, isNoMore, searchValue, searchValueAction, categoryUrl, pageTitle, childComponent} = props;
  const [focus, setFocus] = useState(false);

  const PAGE_SIZE = 20;
  const hasNextPage = data.length >= PAGE_SIZE;

  let awaitMore = !isLoading && hasNextPage && !isNoMore;

  const handleSearchChange = (newValue: string) => {
    searchValueAction(newValue);
  };

  const renderItem = (index) => {
    const item = data[index];
    return (
      <div key={index}>
        {React.createElement(childComponent, {
          item: item,
          categoryUrl: categoryUrl,
        })}
      </div>
    );
  };

  const onIntersection = (size, pageSize) => {
    cursorAction();
  };

  return (<>
    <div className="searchable-listing-container ng-margin-bottom ng-background-dkgray
      ng-padding-medium">
      <div
        className={classnames({
          'ng-input-container ng-c-flex-grow-1 ng-flex ng-flex-middle': true,
          'is-focused': focus
        })}>
        <i className=" ng-icon ng-icon-small ng-icon-search ng-color-mdgray ng-margin-small-horizontal"/>
        <input
          type=" text"
          placeholder={`search ${pageTitle.toLowerCase()}...`}
          className=" ng-width-1-1 ng-search-box"
          onFocus={() => setFocus(!focus)}
          onChange={(e) => handleSearchChange(e.target.value)}
          value={searchValue}
          ref={input => input && input.getBoundingClientRect().top > 0 && input.focus()}
        />
      </div>

    </div>
    <div style={{height: '600px', 'overflowY': 'scroll'}} className=" ng-c-width-100">
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
      {isLoading && <Spinner position=" relative"/>}
    </div>
  </>);
};

export default DataListing;
