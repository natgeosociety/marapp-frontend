import BackToLocation from 'components/back-to-location';
import FilterBy from 'components/filter-by';
import SearchBox from 'components/searchbox';
import SidebarLayoutSearch from 'components/sidebar/sidebar-layout-search';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { push } from 'redux-first-router';
import { hasFilters } from 'utils/filters';
import PlacesSearchResults from './search-results';
import useLocations from 'fetchers/useLocations';
import { serializeFilters } from '@marapp/earth-shared';

interface IProps {
  selected: boolean;
  children: any;
  panel?: string;
  panelExpanded?: boolean;
  search?: any;
  results?: any;
  nextPageCursor?: string;
  group?: any;
  locationName?: string;
  locationOrganization?: string;
  nextPlacesPage?: () => void;
  setSidebarPanelExpanded?: (value: boolean) => void;
  resetMap?: () => {};
  resetPlace?: (value: any) => {};
  resetCollection?: () => {};
  setIndexesSelected?: (value: any) => {};
  setPlacesSearch?: (value: any) => {};
  setPlacesSearchOpen?: (value: boolean) => {};
}

const Places = (props: IProps) => {
  const { t } = useTranslation();
  const {
    panelExpanded,
    search,
    group,
    locationName,
    locationOrganization,
    resetPlace,
    resetCollection,
    resetMap,
    setPlacesSearch,
    setSidebarPanelExpanded,
    setPlacesSearchOpen,
    selected,
    children,
  } = props;

  const { metadata } = useLocations({
    search: search.search,
    filter: serializeFilters(search.filters),
    select: 'name,slug,organization,type',
    group: group.join(),
  });

  const hasSearchTerm = !!search.search;
  const showX = selected || hasSearchTerm;
  const showFilter = !selected || panelExpanded;
  const withFilters = hasFilters(search.filters);
  const showResults = hasSearchTerm || withFilters;
  const showBack = selected && panelExpanded && showResults;
  const onLocationPage = selected && panelExpanded && showResults;
  const onHomepage = !selected && showResults;
  const showSearchResults = onLocationPage || onHomepage;

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
    resetCollection();
    resetPlace({ keepCache: true });
    setPlacesSearch({ search: '' });
    resetMap();
    push('/earth');
  };

  return (
    <SidebarLayoutSearch
      fixedContent={
        <>
          <SearchBox
            value={search.search}
            placeholder={t('search places')}
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
              filters={search.filters}
              availableFilters={metadata?.filters || {}}
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
      {showSearchResults ? (
        <PlacesSearchResults
          search={search.search}
          filters={search.filters}
          group={group}
          setPlacesSearch={setPlacesSearch}
        />
      ) : (
        children
      )}
    </SidebarLayoutSearch>
  );
};

export default Places;
