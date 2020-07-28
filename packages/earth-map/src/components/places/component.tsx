import React from 'react';
import { push } from 'redux-first-router';

import FeaturedPlaces from 'components/places/featured-places';
import PlacesResults from 'components/places/list';
import IndexSidebar from 'components/index-sidebar';
import LastViewedPlace from 'components/last-viewed-place';
import { IPlace } from 'modules/places/model';
import SearchBox from 'components/searchbox';
import FilterBy from 'components/filter-by';
import SidebarLayoutSearch from 'components/sidebar/sidebar-layout-search';
import { hasFilters } from 'utils/filters';

interface IProps {
  selected: boolean;
  panelExpanded?: boolean;
  search?: any;
  group?: any;
  locationName?: string;
  locationOrganization?: string;
  lastViewedPlace?: IPlace;
  setSidebarPanel?: (value: any) => void;
  setSidebarPanelExpanded?: (value: boolean) => void;
  resetMap?: () => {};
  resetPlace?: () => {};
  setIndexesSelected?: (value: any) => {};
  setPlacesSearch?: (value: any) => {};
}

const Places = (props: IProps) => {
  const {
    selected,
    panelExpanded,
    search,
    group,
    locationName,
    locationOrganization,
    lastViewedPlace,
    resetPlace,
    resetMap,
    setIndexesSelected,
    setPlacesSearch,
    setSidebarPanel,
    setSidebarPanelExpanded,
  } = props;
  const hasSearchTerm = !!search.search;
  const showX = selected || hasSearchTerm;
  const showFilter = !selected || panelExpanded;
  const withFilters = hasFilters(search.filters);
  const showResults = hasSearchTerm || withFilters;
  const showBack = selected && panelExpanded && showResults;
  const onLocationPage = selected && panelExpanded && showResults;
  const onHomepage = !selected && showResults;
  const showLastViewedPlace = lastViewedPlace && group.includes(lastViewedPlace.organization)

  const handleChange = (e) => {
    const newValue = e.target.value;
    setPlacesSearch({ search: newValue });
  };

  const handleBack = () => {
    if (selected) {
      setPlacesSearch({ search: locationName });
    }
    setSidebarPanelExpanded(false);
  }

  const handleResetLocation = () => {
    resetPlace();
    setPlacesSearch({ search: '' });
    setIndexesSelected('');
    resetMap();
    push('/earth');
  };

  return (
    <SidebarLayoutSearch
      setSidebarPanel={setSidebarPanel}
      fixedContent={
        <div>
          <SearchBox
            value={search.search}
            placeholder="search places"
            onChange={handleChange}
            onReset={handleResetLocation}
            onFocus={() => setSidebarPanelExpanded(true)}
            showClose={showX} />
          {showFilter && <FilterBy />}
          {showBack && (
            <div
              onClick={handleBack}
              className="ng-c-cursor-pointer ng-padding-vertical ng-padding-medium-horizontal ng-ep-background-dark ng-ep-border-top">
              <em className="ng-color-white">
                Return to {locationName}<span className="ng-icon-bullet ng-margin-small-horizontal" /><span className="ng-color-mdgray">{locationOrganization}</span>
              </em>
            </div>
          )}
        </div>
      }>
      {(onLocationPage || onHomepage)
        ? <PlacesResults />
        : selected
          ? <IndexSidebar />
          : (
            <>
              {(showLastViewedPlace && <LastViewedPlace place={lastViewedPlace} />)}
              <FeaturedPlaces />
            </>
          )}
    </SidebarLayoutSearch>
  )
}

export default Places;