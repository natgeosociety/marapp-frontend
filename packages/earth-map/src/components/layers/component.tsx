import React from 'react';
import { groupBy, debounce } from 'lodash';

import { APP_BASEMAPS } from '../../theme';

// Components
import { Spinner } from '@marapp/earth-components';
import { LayerComponent } from './layer';
// styles
import './styles.scss';

interface ILayers {
  panel?: string;
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
  setSidebarLayers?: (any) => void;
  loading?: boolean;
  layers?: any;
  open?: boolean;
  layersPanel?: boolean;
  group?: string;
}

interface ILayersState {
  toggles?: { settings?: any };
  groupedLayers?: any;
}

class LayersComponent extends React.PureComponent<ILayers, ILayersState> {
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

  componentWillReceiveProps(nextProps: Readonly<ILayers>, nextContext: any) {
    const {
      layers: { list },
    } = nextProps;

    this.setState({ groupedLayers: groupBy(list, 'organization') });
  }

  componentDidUpdate(prevProps) {
    const { panel } = this.props;

    const { panel: prevPanel } = prevProps;

    if (panel !== prevPanel && panel === 'layers') {
      this.layers.scrollTop = 0;
    }
  }

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

  handleToggleClick() {
    this.props.setSidebarLayers(false);
  }

  render() {
    const { loading, mapLabels, mapRoads, layers, group } = this.props;
    const { groupedLayers } = this.state;

    return (
      <>
        {loading && <Spinner />}
        <div className="ng-flex ng-flex-space-between ng-flex-center ng-margin-medium-bottom">
          <h4 className="ng-text-display-m ng-color-ultraltgray ng-margin-remove ng-c-flex-grow-1">Select layers</h4>
          <button
            className="ng-unstyled ng-c-icon-with-label"
            onClick={() => this.handleToggleClick()}
          >
            <i className="ng-icon-close"></i>
            <span className="ng-c-icon-label">CLOSE</span>
          </button>
        </div>
        <div style={{ overflow: 'auto' }}>
          {groupedLayers &&
            Object.keys(groupedLayers).map((t, idx) => (
              <div className="ng-margin-medium-vertical" key={idx}>
                {group.length > 1 && (
                  <p className="ng-text-display-s ng-margin-bottom">
                    {t} <span className="ng-color-mdgray">({groupedLayers[t].length})</span>
                  </p>
                )}
                {groupedLayers[t].map((layer, i) => (
                  <LayerComponent
                    layer={layer}
                    key={i}
                    active={!!layers.active.find((slug) => slug === layer.slug)}
                    toggleLayer={debounce(() => this.onToggleLayer(layer), 200)}
                  />
                ))}
              </div>
            ))}

          <div className="ng-ep-border-top ng-margin-top ng-padding-medium-top">
            <LayerComponent
              layer={{ name: 'Labels', key: 'labels', slug: 'labels' }}
              active={mapLabels}
              toggleLayer={() => this.onLabels()}
            />
            <LayerComponent
              layer={{ name: 'Roads', key: 'roads', slug: 'roads' }}
              active={mapRoads}
              toggleLayer={() => this.onRoads()}
            />
          </div>
        </div>
      </>
    );
  }
}

export default LayersComponent;
