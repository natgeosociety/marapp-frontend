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
    const { slug, id, organization, type, $searchHint } = results[index];
    return (
      <ListItem
        title={$searchHint.name} key={slug}
        linkTo={{ type: 'LOCATION', payload: { slug, id, organization } }}
        labels={[
          type,
          (group.length > 1) && organization
        ]} />
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
      <h2 className="ng-padding-medium ng-text-display-s ng-body-color ng-margin-remove">Search results</h2>
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
