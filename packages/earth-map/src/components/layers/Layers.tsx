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
import { debounce } from 'lodash';

import { APP_BASEMAPS } from 'theme';

import SearchBox from 'components/searchbox';
import FilterBy from 'components/filter-by';
import SidebarLayoutSearch from 'components/sidebar/sidebar-layout-search';
import ListItem from 'components/list-item';
import BackToLocation from 'components/back-to-location';
import InfiniteList from 'components/infinite-list';
import { EPanels } from 'modules/sidebar/model';

import './styles.scss';

interface IProps {
  selected: boolean;
  basemap?: string;
  basemaps?: Array<{
    slug: string;
    name: string;
    background: string;
    id: string;
  }>;
  nextPageCursor?: string;
  setMapStyle?: (id: any) => void;
  mapStyle?: any;
  mapLabels?: any;
  setMapLabels?: (any) => void;
  mapRoads?: any;
  setMapRoads?: (any) => void;
  toggleLayer?: (any) => void;
  layers?: {
    loading?: boolean;
    search?: any;
    active?: string[];
    listActive?: any[];
    results?: any[];
    nextPageCursor?: string;
  };
  open?: boolean;
  layersPanel?: boolean;
  group?: string;
  panel?: string;
  panelExpanded?: boolean;
  locationName?: string;
  locationOrganization?: string;

  setSidebarPanel?: (value: any) => void;
  setSidebarPanelExpanded?: (value: boolean) => void;
  setLayersSearch?: (value: any) => void;
  setPlacesSearch?: (value: any) => void;
  resetLayersActive?: () => void;
  nextLayersPage?: (value: any) => void;
  setLayersSearchOpen?: (value: boolean) => void;
}

const Layers = (props: IProps) => {
  const {
    selected,
    layers,
    group,
    mapLabels,
    mapRoads,
    panel,
    panelExpanded,
    setSidebarPanel,
    setSidebarPanelExpanded,
    locationName,
    locationOrganization,
    setLayersSearch,
    setPlacesSearch,
    resetLayersActive,
    nextLayersPage,
    setLayersSearchOpen,
  } = props;

  const { loading, search, listActive, nextPageCursor } = layers;
  const hasSearchTerm = !!search.search;
  const showX = hasSearchTerm;
  const showFilter = !selected || panelExpanded;
  const showBack = selected && panelExpanded;

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLayersSearch({ search: newValue });
  };

  const handleBack = () => {
    if (selected) {
      setPlacesSearch({ search: locationName });
      setSidebarPanel(EPanels.PLACES);
    }
    setSidebarPanelExpanded(false);
  };

  const handleReset = () => {
    setLayersSearch({
      search: '',
      filters: {},
      open: false,
    });
  }

  const onLabels = () => {
    const { mapLabels, setMapLabels } = props;
    setMapLabels(!mapLabels);
  };

  const onRoads = () => {
    const { mapRoads, setMapRoads } = props;
    setMapRoads(!mapRoads);
  };

  const onToggleLayer = (layer) => {
    const { toggleLayer } = props;
    toggleLayer(layer);
  };

  return (
    <SidebarLayoutSearch
      panel={panel}
      setSidebarPanel={setSidebarPanel}
      fixedContent={
        <>
          <SearchBox
            value={search.search}
            placeholder="search layers"
            onChange={handleChange}
            onReset={handleReset}
            onFocus={() => setSidebarPanelExpanded(true)}
            showClose={showX} />
          {showFilter && (
            <FilterBy
              open={search.open}
              onOpenToggle={setLayersSearchOpen}
              onChange={setLayersSearch}
              data={search} />
          )}
          {showBack && (
            <BackToLocation
              onClick={handleBack}
              location={locationName}
              organization={locationOrganization} />
          )}
        </>
      }>
      {(!selected || panelExpanded) && (
        <>
          {listActive.length > 0 && (
            <div className="marapp-qa-activelayers ng-section-background ng-position-relative ng-padding-medium-bottom ng-margin-bottom">
              <div className="ng-flex ng-flex-space-between ng-flex-align-items-baseline ng-padding-small-bottom ng-padding-medium-horizontal ng-padding-medium-top">
                <h2 className="ng-text-display-s ng-body-color ng-margin-remove">Selected Layers</h2>
                <a className="marapp-qa-deselectlayers" onClick={() => resetLayersActive()}>deselect all</a>
              </div>
              {listActive.map((layer) => {
                return (
                  <ListItem
                    active
                    title={layer.name}
                    key={`${layer.slug}-${layer.organization}`}
                    onClick={debounce(() => onToggleLayer(layer), 200)}
                    organization={(group.length > 1) && layer.organization}
                    labels={layer.category} />
                )
              })}
            </div>
          )}
          <div className="marapp-qa-other ng-section-background ng-position-relative ng-padding-medium-bottom">
            <h2 className="ng-padding-small-bottom ng-padding-medium-horizontal ng-padding-medium-top ng-text-display-s ng-body-color ng-margin-remove">Other</h2>
            <ListItem
              title="Labels"
              active={mapLabels}
              key="labels"
              onClick={debounce(onLabels, 200)} />
            <ListItem
              title="Roads"
              active={mapRoads}
              key="roads"
              onClick={debounce(onRoads, 200)} />
          </div>
          <InfiniteList
            title="Widget layers"
            data={layers.results}
            loading={loading}
            nextPageCursor={nextPageCursor}
            onNextPage={nextLayersPage}>
            {(layer) => (
              <ListItem
                hint={layer.$searchHint.name}
                title={layer.name}
                active={!!listActive.find((x) => x.slug === layer.slug)}
                key={`${layer.slug}-${layer.organization}`}
                onClick={debounce(() => onToggleLayer(layer), 200)}
                organization={(group.length > 1) && layer.organization}
                labels={layer.category} />
            )}
          </InfiniteList>
        </>
      )}
    </SidebarLayoutSearch>
  );
}

export default Layers;
