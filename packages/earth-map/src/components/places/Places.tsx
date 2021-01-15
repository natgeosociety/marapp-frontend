import BackToLocation from 'components/back-to-location';
import FilterBy from 'components/filter-by';
import InfiniteList from 'components/infinite-list';
import ListItem from 'components/list-item';
import SearchBox from 'components/searchbox';
import SidebarLayoutSearch from 'components/sidebar/sidebar-layout-search';
import { LocationTypeEnum } from 'modules/places/model';
import { EarthRoutes } from 'modules/router/model';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { push } from 'redux-first-router';
import { hasFilters } from 'utils/filters';
import useSWR from 'swr';
import { merge } from 'lodash/fp';
import { generateCacheKey } from 'services/base/APIBase';
import { LOCATION_QUERY } from 'sagas/model';
import PlacesService from 'services/PlacesService';
import PlacesSearchResults from './search-results';
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
    // results,
    // nextPageCursor,
    group,
    locationName,
    locationOrganization,
    // nextPlacesPage,
    resetPlace,
    resetCollection,
    resetMap,
    setPlacesSearch,
    setSidebarPanelExpanded,
    setPlacesSearchOpen,
    selected,
    children,
  } = props;

  const nextPageCursor = 'x';

  const nextPlacesPage = () => {
    console.log('!!next places page');
  };

  const page = 0;

  const query = merge(LOCATION_QUERY, { group: group.join(), search: search.search });
  const cacheKey = generateCacheKey(`places/${page}`, query);

  const fetcher = () => PlacesService.fetchPlaces(query).then((response: any) => response.data);

  const { data: results = [], error, revalidate, mutate } = useSWR(cacheKey, fetcher);

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
      {showSearchResults ? <PlacesSearchResults search={search.search} group={group} /> : children}
    </SidebarLayoutSearch>
  );
};

export default Places;
