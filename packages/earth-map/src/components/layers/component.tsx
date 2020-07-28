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
import { groupBy, debounce } from 'lodash';
import { Spinner } from '@marapp/earth-components';

import { APP_BASEMAPS } from '../../theme';

import SearchBox from 'components/searchbox';
import FilterBy from 'components/filter-by';
import SidebarLayoutSearch from 'components/sidebar/sidebar-layout-search';
import { LayerComponent } from './layer';
import { hasFilters } from 'utils/filters';

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
  groups?: {};
  setMapStyle?: (id: any) => void;
  mapStyle?: any;
  mapLabels?: any;
  setMapLabels?: (any) => void;
  mapRoads?: any;
  setMapRoads?: (any) => void;
  toggleLayer?: (any) => void;
  loading?: boolean;
  layers?: any;
  open?: boolean;
  layersPanel?: boolean;
  group?: string;
  panelExpanded?: boolean;
  search?: any;
  locationName?: string;
  locationOrganization?: string;

  resetMap?: () => {};
  setSidebarPanel?: (value: any) => void;
  setSidebarPanelExpanded?: (value: boolean) => void;
}

interface IState {
  toggles?: { settings?: any };
  groupedLayers?: any;
}

class LayersComponent extends React.PureComponent<IProps, IState> {
  static defaultProps = {
    basemap: 'default',
    basemaps: APP_BASEMAPS,
  };
  private layers: any;

  constructor(props) {
    super(props);
    this.state = {
      toggles: {},
      groupedLayers: {},
    };
  }

  componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any) {
    const {
      layers: { list },
    } = nextProps;

    this.setState({ groupedLayers: groupBy(list, 'organization') });
  }

  // componentDidUpdate(prevProps) {
  //   const { panel } = this.props;

  //   const { panel: prevPanel } = prevProps;

  //   if (panel !== prevPanel && panel === 'layers') {
  //     this.layers.scrollTop = 0;
  //   }
  // }

  onLabels = () => {
    const { mapLabels, setMapLabels } = this.props;
    setMapLabels(!mapLabels);
  };

  onRoads = () => {
    const { mapRoads, setMapRoads } = this.props;
    setMapRoads(!mapRoads);
  };

  onToggleLayer = (layer) => {
    const { toggleLayer } = this.props;
    toggleLayer(layer);
  };

  render() {
    const {
      selected,
      loading,
      mapLabels,
      mapRoads,
      layers,
      group,

      search,
      panelExpanded,
      resetMap,
      setSidebarPanel,
      setSidebarPanelExpanded,
      locationName,
      locationOrganization,
    } = this.props;
    const hasSearchTerm = !!search.search;
    const showX = selected || hasSearchTerm;
    const showFilter = !selected || panelExpanded;
    const withFilters = hasFilters(search.filters);
    const showResults = hasSearchTerm || withFilters;
    const showBack = selected && panelExpanded && showResults;
    const onLocationPage = selected && panelExpanded && showResults;
    const onHomepage = !selected && showResults;
    const { groupedLayers } = this.state;

    return (
      <SidebarLayoutSearch
        setSidebarPanel={setSidebarPanel}
        fixedContent={
          <div>
            <SearchBox
              value="test"
              placeholder="search a place"
              onChange={() => { }}
              onReset={() => { }}
              onFocus={() => setSidebarPanelExpanded(true)}
              showClose={showX} />
            {showFilter && <FilterBy />}
            {showBack && (
              <div
                onClick={() => { }}
                className="ng-c-cursor-pointer ng-padding-vertical ng-padding-medium-horizontal ng-ep-background-dark ng-ep-border-top">
                <em className="ng-color-white">
                  Return to {locationName}<span className="ng-icon-bullet ng-margin-small-horizontal" /><span className="ng-color-mdgray">{locationOrganization}</span>
                </em>
              </div>
            )}
          </div>
        }>
        <div>This are the layers</div>
      </SidebarLayoutSearch>
    );
  }
}

export default LayersComponent;
