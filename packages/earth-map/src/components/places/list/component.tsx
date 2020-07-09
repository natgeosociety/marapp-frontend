import React from 'react';
import Link from 'redux-first-router-link';
import List from '@researchgate/react-intersection-list';

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
    const { slug, name, id, organization } = results[index];
    return (
      <div onClick={() => onClickIndex(name)} key={slug}>
        <Link
          to={{ type: 'LOCATION', payload: { slug, id, organization } }}
          className="ng-c-panel-link ng-unstyled ng-margin-bottom"
        >
          {name}
          {group.length > 1 && (
            <span className="ng-margin-left ng-color-mdgray">{organization}</span>
          )}
        </Link>
      </div>
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
    <div className="ng-padding-medium ng-section-background ng-position-relative">
      <h2 className="ng-text-display-s ng-body-color ng-margin-medium-bottom">Search results</h2>
      <List
        awaitMore={awaitMore}
        pageSize={PAGE_SIZE}
        itemCount={results.length}
        renderItem={renderItem}
        onIntersection={onIntersection}
      />
    </div>
  );
};

export default PlacesResultsComponent;
