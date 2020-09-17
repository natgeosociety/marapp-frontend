import BackToLocation from 'components/back-to-location';
import FilterBy from 'components/filter-by';
import IndexSidebar from 'components/index-sidebar';
import InfiniteList from 'components/infinite-list';
import LastViewedPlace from 'components/last-viewed-place';
import ListItem from 'components/list-item';
import FeaturedPlaces from 'components/places/featured-places';
import SearchBox from 'components/searchbox';
import SidebarLayoutSearch from 'components/sidebar/sidebar-layout-search';
import { IPlace } from 'modules/places/model';
import React from 'react';
import { push } from 'redux-first-router';
import { hasFilters } from 'utils/filters';

interface IProps {
  selected: boolean;
  panel?: string;
  panelExpanded?: boolean;
  search?: any;
  results?: any;
  nextPageCursor?: string;
  group?: any;
  locationName?: string;
  locationOrganization?: string;
  lastViewedPlace?: IPlace;
  nextPlacesPage?: () => void;
  setSidebarPanel?: (value: any) => void;
  setSidebarPanelExpanded?: (value: boolean) => void;
  resetMap?: () => {};
  resetPlace?: (value: any) => {};
  setIndexesSelected?: (value: any) => {};
  setPlacesSearch?: (value: any) => {};
  setPlacesSearchOpen?: (value: boolean) => {};
}

const Places = (props: IProps) => {
  const {
    selected,
    panel,
    panelExpanded,
    search,
    results,
    nextPageCursor,
    group,
    locationName,
    locationOrganization,
    lastViewedPlace,
    nextPlacesPage,
    resetPlace,
    resetMap,
    setIndexesSelected,
    setPlacesSearch,
    setSidebarPanel,
    setSidebarPanelExpanded,
    setPlacesSearchOpen,
  } = props;
  const hasSearchTerm = !!search.search;
  const showX = selected || hasSearchTerm;
  const showFilter = !selected || panelExpanded;
  const withFilters = hasFilters(search.filters);
  const showResults = hasSearchTerm || withFilters;
  const showBack = selected && panelExpanded && showResults;
  const onLocationPage = selected && panelExpanded && showResults;
  const onHomepage = !selected && showResults;
  const showLastViewedPlace = lastViewedPlace && group.includes(lastViewedPlace.organization);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setPlacesSearch({ search: newValue });
  };

  const handleBack = () => {
    if (selected) {
      setPlacesSearch({ search: locationName });
    }
    setSidebarPanelExpanded(false);
  };

  const handleReset = () => {
    resetPlace({ keepCache: true });
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
            showClose={showX}
          />
          {showFilter && (
            <FilterBy
              open={search.open}
              onOpenToggle={setPlacesSearchOpen}
              onChange={setPlacesSearch}
              data={search}
            />
          )}
          {showBack && (
            <BackToLocation
              onClick={handleBack}
              location={locationName}
              organization={locationOrganization}
            />
          )}
        </>
      }
    >
      {onLocationPage || onHomepage ? (
        <InfiniteList
          title="Search results"
          data={results}
          loading={search.loading}
          nextPageCursor={nextPageCursor}
          onNextPage={nextPlacesPage}
        >
          {({ id, $searchHint, name, slug, organization, type }) => (
            <ListItem
              hint={$searchHint.name}
              title={name}
              key={`${slug}-${organization}`}
              linkTo={{ type: 'LOCATION', payload: { slug, id, organization } }}
              organization={group.length > 1 && organization}
              labels={[type]}
            />
          )}
        </InfiniteList>
      ) : selected ? (
        <IndexSidebar />
      ) : (
        <>
          {showLastViewedPlace && <LastViewedPlace place={lastViewedPlace} />}
          <FeaturedPlaces />
        </>
      )}
    </SidebarLayoutSearch>
  );
};

export default Places;
