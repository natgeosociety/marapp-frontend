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

import Box from '@material-ui/core/Box';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { push } from 'redux-first-router';

import { useAuth0 } from '../../auth/auth0';
import BackToLocation from '../../components/back-to-location';
import FilterBy from '../../components/filter-by';
import SearchBox from '../../components/searchbox';
import SidebarLayoutSearch from '../../components/sidebar/sidebar-layout-search';
import { QUERY_LOCATIONS, useLocations } from '../../fetchers';
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
  locationName?: string;
  locationOrganization?: string;
  setSidebarOpen?: (value: boolean) => void;
  setSidebarPanelExpanded?: (value: boolean) => void;
  resetMap?: () => {};
  setIndexesSelected?: (value: any) => {};
  setPlacesSearch?: (value: any) => {};
  setPlacesSearchOpen?: (value: boolean) => {};
}

const Places = (props: IProps) => {
  const { t } = useTranslation();
  const {
    panelExpanded,
    search,
    locationName,
    locationOrganization,
    resetMap,
    setPlacesSearch,
    setSidebarPanelExpanded,
    setSidebarOpen,
    setPlacesSearchOpen,
    selected,
    children,
  } = props;

  const { selectedGroup } = useAuth0();
  const { data: placesData, meta, awaitMore, nextPage, isValidating } = useLocations(
    QUERY_LOCATIONS.getFiltered(search.search, search.filters)
  );

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
      <Box mt={1}>
        {showSearchResults ? (
          <PlacesSearchResults
            data={placesData}
            awaitMore={awaitMore}
            nextPage={nextPage}
            group={selectedGroup}
            isValidating={isValidating}
            setPlacesSearch={setPlacesSearch}
            search={search.search}
            filters={search.filters}
            setSidebarPanelExpanded={setSidebarPanelExpanded}
            setSidebarOpen={setSidebarOpen}
          />
        ) : (
          children
        )}
      </Box>
    </SidebarLayoutSearch>
  );
};

export default Places;
