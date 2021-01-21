/*
  Copyright 2018-2020 National Geographic Society

  Use of this software does not constitute endorsement by National Geographic
  Society (NGS). The NGS name and NGS logo may not be used for any purpose without
  written permission from NGS.

  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at

      https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed
  under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
  CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

import React from 'react';
import { useTranslation } from 'react-i18next';
import { push } from 'redux-first-router';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import { serializeFilters } from '@marapp/earth-shared';

import BackToLocation from '../../components/back-to-location';
import FilterBy from '../../components/filter-by';
import InfiniteList from '../../components/infinite-list';
import ListItem from '../../components/list-item';
import MenuItemSkeleton from '../../components/MenuItemSkeleton';
import SearchBox from '../../components/searchbox';
import SidebarLayoutSearch from '../../components/sidebar/sidebar-layout-search';
import { LocationTypeEnum } from '../../modules/places/model';
import { EarthRoutes } from '../../modules/router/model';
import { setSidebarOpen } from '../../modules/sidebar/actions';
import useLocations from '../../fetchers/useLocations';
import { hasFilters } from '../../utils/filters';
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
  setSidebarOpen?: (value: boolean) => void;
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
    setSidebarOpen,
    setPlacesSearchOpen,
    selected,
    children,
  } = props;

  const { meta } = useLocations({
    search: search.search,
    filter: serializeFilters(search.filters),
    select: 'name,slug,organization,type',
    group: group.join(),
  });

  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down('sm'));
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

  const fakeResultsMapping = {
    '1': 10,
    '2': 5,
    '3': 2,
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
              availableFilters={meta?.filters}
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

      {/*
       {showSearchResults ? (
        <InfiniteList
          title={t('Search results')}
          data={
            search.loading
              ? Array(fakeResultsMapping[search.search.length] || 1).fill(null)
              : results
          }
          loading={false}
          nextPageCursor={nextPageCursor}
          onNextPage={nextPlacesPage}
        >
          {(item) =>
            search.loading ? (
              <MenuItemSkeleton />
            ) : (
              <ListItem
                hint={item.$searchHint.name}
                title={item.name}
                key={`${item.slug}-${item.organization}`}
                onClick={() => {
                  setSidebarPanelExpanded(false);
                  setPlacesSearch({ search: item.name });

                  isSmallDevice && setSidebarOpen(false);
                }}
                linkTo={{
                  type:
                    item.type === LocationTypeEnum.COLLECTION
                      ? EarthRoutes.COLLECTION
                      : EarthRoutes.LOCATION,
                  payload: {
                    slug: item.slug,
                    id: item.id,
                    organization: item.organization,
                  },
                }}
                organization={group.length > 1 && item.organization}
                labels={[item.type]}
              />
            )
          }
        </InfiniteList>
      */}
    </SidebarLayoutSearch>
  );
};

export default Places;
