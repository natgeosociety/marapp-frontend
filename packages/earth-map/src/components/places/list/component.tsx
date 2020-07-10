import React from 'react';
import List from '@researchgate/react-intersection-list';
import { Spinner } from '@marapp/earth-components';

import ListItem from 'components/list-item';

import './styles.scss';

interface IPlacesList {
  loading?: boolean;
  nextPageCursor?: string;
  setIndexesSelected?: (s: string) => any;
  setPlacesSearch?: Function;
  nextPlacesPage?: Function;
  setPlacesSearchResults?: Function;
  list?: [];
  results?: IPlacesListItem[];
  group?: string;
}

interface IPlacesListItem {
  slug: string;
  id: string;
  name: string;
  organization: string;
  type: string;
}

const PlacesResultsComponent = (props: IPlacesList) => {
  const {
    nextPageCursor,
    loading,
    results,
    setIndexesSelected,
    setPlacesSearch,
    nextPlacesPage,
    list,
    group,
  } = props;
  const PAGE_SIZE = 100;
  const hasNextPage = results.length >= PAGE_SIZE;
  const awaitMore = !loading && !!nextPageCursor && hasNextPage;
  const renderItem = (index) => {
    const { slug, name, id, organization, type } = results[index];
    return (
      <ListItem
        title={name} key={slug}
        linkTo={{ type: 'LOCATION', payload: { slug, id, organization } }}
        onClick={() => onClickIndex(name)}
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

  const onClickIndex = (name) => {
    // @ts-ignore
    setPlacesSearch({ search: name });
    // @ts-ignore
    !!list[0] && setIndexesSelected(list[0].slug);
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
