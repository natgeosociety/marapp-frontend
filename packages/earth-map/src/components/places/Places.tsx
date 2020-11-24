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
    results,
    nextPageCursor,
    group,
    locationName,
    locationOrganization,
    nextPlacesPage,
    resetPlace,
    resetCollection,
    resetMap,
    setPlacesSearch,
    setSidebarPanelExpanded,
    setPlacesSearchOpen,
    selected,
    children,
  } = props;

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
      {showSearchResults ? (
        <InfiniteList
          title={t('Search results')}
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
              onClick={() => {
                setSidebarPanelExpanded(false);
                setPlacesSearch({ search: name });
              }}
              linkTo={{
                type:
                  type === LocationTypeEnum.COLLECTION
                    ? EarthRoutes.COLLECTION
                    : EarthRoutes.LOCATION,
                payload: { slug, id, organization },
              }}
              organization={group.length > 1 && organization}
              labels={[type]}
            />
          )}
        </InfiniteList>
      ) : (
        children
      )}
    </SidebarLayoutSearch>
  );
};

export default Places;
