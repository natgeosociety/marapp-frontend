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

import List from '@researchgate/react-intersection-list';

import './styles.scss';
import {LocationContext} from 'utils/contexts';
import {Spinner} from '@marapp/earth-components';
import {LinkWithOrg} from 'components/LinkWithOrg';

const DataListing = (props) => {
  const {cursorAction, data, isLoading, isNoMore, searchValue, searchValueAction, categoryUrl, pageTitle} = props;

  const PAGE_SIZE = 20;
  const hasNextPage = data.length >= PAGE_SIZE;

  let awaitMore = !isLoading && hasNextPage && !isNoMore;

  const handleSearchChange = (newValue: string) => {
    searchValueAction(newValue);
  };

  const renderItem = (index) => {
    const {slug, id, type, name} = data[index];
    return (
      <LinkWithOrg
        to={`/${categoryUrl}/${id}`}
        className="ng-c-data-link ng-display-block ng-padding-medium-horizontal ng-padding-vertical"
        key={index}
      >
        <span className="ng-text-edit-s ng-margin-remove">{name}</span>
        <span className="ng-display-block">{slug}</span>
      </LinkWithOrg>
    );


  };

  const onIntersection = (size, pageSize) => {
    cursorAction();
  };

  return (<>
    <div className="searchable-listing-container ng-width-1-1 ng-margin-small-bottom">
      <input
        type="text"
        placeholder={`Search for ${pageTitle.toLowerCase()}...`}
        className="ng-padding ng-width-1-1"
        onChange={(e) => handleSearchChange(e.target.value)}
        value={searchValue}
        ref={input => input && input.getBoundingClientRect().top > 0 && input.focus()}
      />
    </div>
    <div style={{height: '600px', 'overflowY': 'scroll'}}>
      <List
        awaitMore={awaitMore}
        pageSize={PAGE_SIZE}
        itemCount={data.length}
        renderItem={renderItem}
        onIntersection={onIntersection}
      />
      {isLoading && <Spinner position="relative"/>}
    </div>
  </>);
};

export default DataListing;
