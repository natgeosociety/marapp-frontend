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

import cn from 'classnames';
import { orderBy, sortBy } from 'lodash';
import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import Paper from '@material-ui/core/Paper';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { bindTrigger, usePopupState } from 'material-ui-popup-state/hooks';
import IconDotsHorizontal from 'mdi-material-ui/DotsHorizontal';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InView } from 'react-intersection-observer';

import { AuthzGuards, Menu, TitleHero } from '@marapp/earth-shared';

import { useAuth0 } from '../../auth/auth0';
import Widget from '../../components/widget';
import TEMPLATES from '../../components/widget/templates';
import CONFIGS from '../../components/widget/templates/configs';
import { flattenLayerConfig } from '../../fetchers/transformers';
import { ILayer } from '../../modules/layers/model';
import { IPlace } from '../../modules/places/model';
import { ClipLayer } from '../clip-layer';
import './styles.scss';

interface IProps {
  groups?: string[];
  place?: Partial<IPlace>;
  embed?: boolean;
  toolbar?: boolean;
  activeLayers: ILayer[];
  setSidebarInfo?: (s: any) => {};
  toggleLayer?: (s: any) => {};
  dashboards: any[];
}

interface IWidgetsState {
  collapsedState?: {};
  share?: boolean;
  widgetId?: string;
}

const useStyles = makeStyles((theme) => ({
  header: {
    backgroundColor: theme.palette.background.default,
  },
}));

export default function WidgetsComponent(props: IProps) {
  const { groups, place, embed, toolbar, toggleLayer, dashboards, activeLayers } = props;
  const { metrics = [{}] } = place;
  const [widgetState, setWidgetState] = useState<IWidgetsState>({
    collapsedState: {},
    share: false,
    widgetId: null,
  });
  const { getPermissions } = useAuth0();
  const popupState = usePopupState({ variant: 'popover', popupId: 'demoMenu' });
  const [isOnClipLayer, setIsOnClipLayer] = useState(false);
  const { collapsedState } = widgetState;
  const { t } = useTranslation();
  const classes = useStyles();
  const canExport = getPermissions(AuthzGuards.readExportsGuard, place.organization);

  const widgetsData = dashboards?.map((dasboard) => dasboard.widgets).flat();
  const slugs = sortBy(widgetsData, ['organization', 'name'])
    .filter((w) => !!w.slug)
    .map((w) => ({
      slug: w.slug,
      collapsed: false,
      box: true,
    }));
  const widgets = parseWidgets(place, widgetsData, activeLayers, slugs);

  const editActions = (
    <>
      <Fab size="small" {...bindTrigger(popupState)}>
        <IconDotsHorizontal />
      </Fab>
      <Menu
        popupState={popupState}
        options={[{ label: t('Clip and Export Layers'), onClick: () => setIsOnClipLayer(true) }]}
      />
    </>
  );

  return (
    <div className="marapp-qa-widgets c-widgets">
      {isOnClipLayer && (
        <ClipLayer place={place} onCancel={() => setIsOnClipLayer(false)} groups={groups} />
      )}
      <div className="widgets--content">
        <Paper square={true} elevation={3} className={classes.header}>
          <Box p={2}>
            <TitleHero
              title={place.name}
              subtitle={place.organization}
              extra={place.type}
              actions={canExport ? editActions : null}
            />
          </Box>
        </Paper>
        {widgets.map((w: any, i) => {
          const [widgetMetricName] = w.metrics;

          const [filteredMetric] = metrics.filter(
            (metric: any) => metric.slug === widgetMetricName
          );

          return (
            <div key={`${w.slug}-${i}`} className="widgets--list-item ng-position-relative">
              <InView threshold={0.2} triggerOnce={true}>
                {({ ref, inView }) => (
                  <div style={{ minHeight: inView ? 0 : '40vh' }} ref={ref}>
                    {inView && (
                      <Widget
                        {...w}
                        {...(typeof collapsedState[widgetMetricName] !== 'undefined' && {
                          collapsed: collapsedState[widgetMetricName],
                        })}
                        {...CONFIGS[widgetMetricName]}
                        id={place.slug}
                        place={place}
                        widgetDescription={w.description}
                        metric={!!filteredMetric ? filteredMetric : {}}
                        showOrgLabel={groups.length > 1}
                        embed={embed}
                        toolbar={toolbar}
                        activeDownload={false} // To be done, only if it's necessary
                        onShare={() => setWidgetState({ share: true, widgetId: w.id })}
                        onCollapse={(c) => {
                          setWidgetState({
                            collapsedState: { ...collapsedState, [widgetMetricName]: c },
                          });
                        }}
                        onToggleLayer={(bool) => {
                          const { layers } = w;

                          if (layers[0]) {
                            toggleLayer(layers[0]);
                          }
                        }}
                      >
                        {({ slug, data, ...props }) => (
                          <React.Fragment>
                            {/* Template */}
                            {!!TEMPLATES[widgetMetricName] &&
                              React.createElement(TEMPLATES[widgetMetricName], {
                                ...data,
                                ...props,
                              })}
                          </React.Fragment>
                        )}
                      </Widget>
                    )}
                  </div>
                )}
              </InView>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function parseWidgets(place, widgets, activeLayers, slugs) {
  if (!widgets) {
    return [];
  }

  const filteredWidgets = widgets
    .filter((widget) => {
      const { location_types } = widget.config.widgetConfig;

      const thereIsSlug = !!slugs.find((s) => s.slug === widget.slug);
      const thereIsLocationType = Array.isArray(location_types)
        ? location_types.includes(place.locationType.toLowerCase())
        : true;

      return thereIsSlug && thereIsLocationType;
    })
    .map((widget) => ({
      ...widget,
      ...widget.config,
      ...{ layers: widget.layers.map(flattenLayerConfig) },
      slug: widget.slug,
      description: widget.description,
      active: !!activeLayers.find((slug) => widget.layers[0] && slug === widget.layers[0].slug),
      params: {
        id: place.id,
      },
    }));

  return orderBy([...filteredWidgets], ['organization', 'name']);
}
