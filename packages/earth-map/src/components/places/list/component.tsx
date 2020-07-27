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

import React from 'react';
import List from '@researchgate/react-intersection-list';
import { Spinner } from '@marapp/earth-components';
import { IPlace } from 'modules/places/model';

import ListItem from 'components/list-item';

import './styles.scss';

interface IPlacesList {
  loading?: boolean;
  nextPageCursor?: string;
  nextPlacesPage?: Function;
  setPlacesSearchResults?: Function;
  results?: IPlace[];
  group?: string;
}

const PlacesResultsComponent = (props: IPlacesList) => {
  const {
    nextPageCursor,
    loading,
    results,
    nextPlacesPage,
    group,
  } = props;
  const PAGE_SIZE = 100;
  const hasNextPage = results.length >= PAGE_SIZE;
  const awaitMore = !loading && !!nextPageCursor && hasNextPage;
  const renderItem = (index) => {
    const { slug, id, organization, type, name, $searchHint } = results[index];
    return (
      <ListItem
        hint={$searchHint.name}
        title={name} key={`${slug}-${organization}`}
        linkTo={{ type: 'LOCATION', payload: { slug, id, organization } }}
        organization={(group.length > 1) && organization}
        labels={[type]} />
    );
  };
  const onIntersection = (size, pageSize) => {
    if (!awaitMore) return;
    nextPlacesPage({
      pageCursor: nextPageCursor,
    });
  };

  return (
    <div className="ng-section-background ng-position-relative ng-padding-medium-bottom">
      <h2 className="ng-padding-small-bottom ng-padding-medium-horizontal ng-padding-medium-top ng-text-display-s ng-body-color ng-margin-remove">Search results</h2>
      <List
        awaitMore={awaitMore}
        pageSize={PAGE_SIZE}
        itemCount={results.length}
        renderItem={renderItem}
        onIntersection={onIntersection}
      />
      {loading && <Spinner position="relative" />}
    </div>
  );
};

export default PlacesResultsComponent;
