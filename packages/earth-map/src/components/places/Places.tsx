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

import { serializeFilters } from '@marapp/earth-shared';

import BackToLocation from '../../components/back-to-location';
import FilterBy from '../../components/filter-by';
import SearchBox from '../../components/searchbox';
import SidebarLayoutSearch from '../../components/sidebar/sidebar-layout-search';
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
          setSidebarPanelExpanded={setSidebarPanelExpanded}
          setSidebarOpen={setSidebarOpen}
        />
      ) : (
        children
      )}
    </SidebarLayoutSearch>
  );
};

export default Places;
