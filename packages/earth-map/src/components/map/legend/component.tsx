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

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withStyles from '@material-ui/core/styles/withStyles';
import debounce from 'lodash/debounce';
import compose from 'lodash/fp/compose';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { animated, Keyframes } from 'react-spring/renderprops.cjs';
import {
  Legend,
  LegendItemButtonInfo,
  LegendItemButtonOpacity,
  LegendItemButtonRemove,
  LegendItemButtonVisibility,
  LegendItemTimeStep,
  LegendItemToolbar,
  LegendItemTypes,
  LegendListItem,
} from 'vizzuality-components';

import { Html } from '@marapp/earth-shared';

import { EarthRoutes, IRouter } from '../../../modules/router/model';
import LegendItemGroup from './legend-item-group';
import './styles.scss';
import TEMPLATES from './templates';

// Creates a spring with predefined animation slots
const LegendWrapper: any = Keyframes.Spring({
  open: { x: 375, opacity: 1, delay: 0 },
  openW: { x: 500, opacity: 1 },
  close: { x: 0, opacity: 1, delay: 100 },
});

const styles = (theme) => ({
  root: {
    backgroundColor: theme.palette.grey['600'],
  },
});

interface ILegend {
  classes: any;
  layerGroups?: [];
  setLayerVisibility?: (data: any) => void;
  setLayerOrder?: (data: any) => void;
  setLayerOpacity?: (data: any) => void;
  setLayerGroupCurrent?: (data: any) => void;
  setLayerInfo?: (data: any) => void;
  toggleLayer?: any;
  setLayerSettings?: (data: any) => void;
  open?: boolean;
  router?: IRouter;
  t?: (arg: any) => any;
}

class LegendComponent extends React.PureComponent<ILegend> {
  public onChangeOpacity = debounce((l, opacity, slug) => {
    const { setLayerOpacity } = this.props;
    setLayerOpacity({ slug, dataset: { id: l.dataset }, opacity });
  }, 250);

  public onRemoveLayer = debounce((layer) => {
    const { toggleLayer } = this.props;
    toggleLayer(layer);
  }, 250);

  public onChangeInfo = (info, slug) => {
    const { setLayerInfo } = this.props;
    setLayerInfo({ slug, info });
  };

  public onChangeVisibility = (l, visibility, slug) => {
    const { setLayerVisibility } = this.props;
    setLayerVisibility({ slug, dataset: { id: l.dataset }, visibility });
  };

  public onChangeOrder = (datasetIds) => {
    const { setLayerOrder } = this.props;
    setLayerOrder({ datasetIds });
  };

  public onChangeCurrent = (l, current, slug) => {
    const { setLayerGroupCurrent } = this.props;

    setLayerGroupCurrent({ slug, current });
  };

  public onChangeLayerDate = (dates, layer) => {
    const { setLayerSettings } = this.props;
    const { slug, decodeConfig } = layer;

    setLayerSettings({
      slug,
      settings: {
        ...(decodeConfig && {
          decodeParams: {
            startDate: dates[0],
            endDate: dates[1],
            trimEndDate: dates[2],
          },
        }),
        ...(!decodeConfig && {
          params: {
            startDate: dates[0],
            endDate: dates[1],
          },
        }),
      },
    });
  };

  public getState = () => {
    const { open, router } = this.props;
    const selectedOpen = [EarthRoutes.LOCATION, EarthRoutes.COLLECTION].includes(router.type);

    if (open) {
      if (selectedOpen) {
        return 'openW';
      }
      return 'open';
    } else {
      return 'close';
    }
  };

  public render() {
    const { classes, t, layerGroups } = this.props;

    const state = this.getState();

    return (
      <LegendWrapper native={true} state={state}>
        {({ x, ...props }) => (
          <animated.div
            className={`${classes.root} c-legend`}
            style={{
              transform: x.interpolate((x) => `translate3d(${x}px,0,0)`),
              ...props,
            }}
          >
            <Legend maxHeight={'65vh'} onChangeOrder={this.onChangeOrder}>
              {layerGroups.map((layerGroup: any, i) => {
                return (
                  <LegendListItem
                    index={i}
                    key={layerGroup.slug}
                    layerGroup={layerGroup}
                    toolbar={
                      <LegendItemToolbar>
                        {layerGroup.description && <LegendItemButtonInfo />}
                        <LegendItemButtonOpacity
                          trackStyle={{
                            background: '#FFCC00',
                          }}
                          handleStyle={{
                            background: '#FFCC00',
                          }}
                        />
                        <LegendItemButtonVisibility />
                        <LegendItemButtonRemove />
                      </LegendItemToolbar>
                    }
                    onChangeInfo={(l) => this.onChangeInfo(true, layerGroup.slug)}
                    onChangeVisibility={(l, visibility) =>
                      this.onChangeVisibility(l, visibility, layerGroup.slug)
                    }
                    onChangeOpacity={(l, opacity) =>
                      this.onChangeOpacity(l, opacity, layerGroup.slug)
                    }
                    onRemoveLayer={(l) => {
                      this.onRemoveLayer(l);
                    }}
                  >
                    {!!TEMPLATES[layerGroup.slug] &&
                      React.createElement(TEMPLATES[layerGroup.slug])}

                    {!!TEMPLATES[layerGroup.legendType] &&
                      React.createElement(TEMPLATES[layerGroup.legendType])}

                    <LegendItemGroup
                      onChangeCurrent={(l, current) =>
                        this.onChangeCurrent(l, current, layerGroup.slug)
                      }
                    />

                    <LegendItemTypes />
                    {!!layerGroup.layers[0].decodeParams && (
                      <LegendItemTimeStep
                        defaultStyles={{
                          handleStyle: {
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.29)',
                            border: '0px',
                            zIndex: 2,
                          },
                          railStyle: { backgroundColor: '#d6d6d9' },
                          dotStyle: { visibility: 'hidden', border: '0px' },
                        }}
                        handleChange={this.onChangeLayerDate}
                      />
                    )}

                    <Dialog
                      open={!!layerGroup.info}
                      onClose={() => this.onChangeInfo(false, layerGroup.slug)}
                      className="marapp-qa-layerinfo"
                    >
                      <DialogTitle>{layerGroup?.name}</DialogTitle>

                      <DialogContent>
                        <Html
                          className="layer-info--html translate-content"
                          html={layerGroup?.description}
                        />
                      </DialogContent>

                      <DialogActions>
                        <Button
                          size="large"
                          className="marapp-qa-modalclose"
                          onClick={() => this.onChangeInfo(false, layerGroup.slug)}
                        >
                          {t('Close')}
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </LegendListItem>
                );
              })}
            </Legend>
          </animated.div>
        )}
      </LegendWrapper>
    );
  }
}

export default compose(withStyles(styles), withTranslation())(LegendComponent);
