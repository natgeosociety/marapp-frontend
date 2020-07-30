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
import BackToLocation from 'components/back-to-location';
import { hasFilters } from 'utils/filters';

interface IProps {
  selected: boolean;
  panel?: string;
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
    panel,
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

  const handleReset = () => {
    resetPlace();
    setPlacesSearch({ search: '' });
    setIndexesSelected('');
    resetMap();
    push('/earth');
  };

  return (
    <SidebarLayoutSearch
      panel={panel}
      setSidebarPanel={setSidebarPanel}
      fixedContent={
        <>
          <SearchBox
            value={search.search}
            placeholder="search places"
            onChange={handleChange}
            onReset={handleReset}
            onFocus={() => setSidebarPanelExpanded(true)}
            showClose={showX} />
          {showFilter && <FilterBy onChange={setPlacesSearch} data={search} />}
          {showBack && (
            <BackToLocation
              onClick={handleBack}
              location={locationName}
              organization={locationOrganization} />
          )}
        </>
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