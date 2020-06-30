import React from 'react';

// styles
import './styles.scss';

import FeaturedPlacesComponent from './featured-places';
import SearchBoxComponent from './searchbox';
import PlacesResultsComponent from './list';
import FilterComponent from './filter-by';
import { Spinner } from '@marapp/earth-components';
import { hasFilters } from 'utils/filters';

interface IPlaces {
  search?: any;
  featured?: [];
  setPlacesSearch?: (value: any) => {};
  selected?: string;
  filters?: any;
}

const PlacesComponent = (props: IPlaces) => {
  const { search, selected } = props;

  const hasSearchTerm = !!search.search;
  const withFilters = hasFilters(search.filters);
  const showFeatured = !hasSearchTerm && !withFilters && !search.loading;
  const showResults = hasSearchTerm || withFilters;
  const showLoading = search.loading;

  return (
    <section className="ng-c-sidebar">
      <SearchBoxComponent />
      {!selected && (
        <div>
          <FilterComponent />
          {showFeatured && <FeaturedPlacesComponent />}
          {showResults && <PlacesResultsComponent />}
          {showLoading && (
            <Spinner position="relative" />
          )}
        </div>
      )}
    </section>
  );
};

export default PlacesComponent;
