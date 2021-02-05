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
import { Icons as VizzIcons } from 'vizzuality-components';

import { ErrorBoundary, Tab, Tabs } from '@marapp/earth-shared';

import { useAuth0 } from '../../auth/auth0';
import CollectionNew from '../../components/collection/collection-new';
import CollectionsCard from '../../components/collection/collections-card';
import Header from '../../components/header';
import LastViewedPlace from '../../components/last-viewed-place';
import LayerConfigError from '../../components/layer-config-error';
import Layers from '../../components/layers';
import Map from '../../components/map';
import Places from '../../components/places';
import FeaturedPlaces from '../../components/places/featured-places';
import Sidebar from '../../components/sidebar';
import Url from '../../components/url';
import { QUERY_LAYERS, useLayers } from '../../fetchers';
import { ILastViewedPlace } from '../../modules/global/model';
import { EarthRoutes, IRouter } from '../../modules/router/model';
import { EPanels } from '../../modules/sidebar/model';
import CollectionDetails from './collection-details';
import PlaceDetails from './place-details';
import './styles.scss';
import { URL_PROPS } from './url';

interface IProps {
  setSidebarPanel?: () => void;
  panel?: EPanels;
  page?: string;
  layersPanel?: boolean;
  lastViewedPlace?: ILastViewedPlace;
  selected?: string;
  collection?: any;
  router?: any;
}

const { EARTH, COLLECTION, LOCATION, NEW_COLLECTION } = EarthRoutes;

const EarthPage = (props: IProps) => {
  const { setSidebarPanel, panel, router, lastViewedPlace, collection } = props;
  const { type, query = {} } = router;
  const { t } = useTranslation();
  const { privateGroups, selectedGroup } = useAuth0();
  const { data: activeLayers, mutate } = useLayers(QUERY_LAYERS.getActive(query.layers));
  const selectedOpen = [LOCATION, COLLECTION, NEW_COLLECTION].includes(type);
  const withHeaderLayout = [EARTH, LOCATION, COLLECTION].includes(type);
  const newCollectionLayout = [NEW_COLLECTION].includes(type);
  const showLastViewedPlace =
    lastViewedPlace && selectedGroup.includes(lastViewedPlace.organization);
  const canCreateCollections = !!privateGroups.length;

  return (
    <main className="marapp-qa-earth l-page marapp-qa-pageearth" role="main">
      <Sidebar selectedOpen={selectedOpen}>
        {withHeaderLayout && (
          <>
            <VizzIcons />
            <Url type="EARTH" urlProps={URL_PROPS} />

            <Header />
            <Tabs
              value={panel}
              onChange={setSidebarPanel}
              className="ng-padding-bottom ng-padding-medium-horizontal ng-ep-background-dark"
            >
              <Tab label={t('Places')} value="places" />
              <Tab label={t('Layers')} value="layers" />
            </Tabs>

            {type === EARTH && (
              <>
                {panel === EPanels.PLACES && (
                  <Places selected={selectedOpen}>
                    <>
                      {showLastViewedPlace && (
                        <LastViewedPlace place={lastViewedPlace} group={selectedGroup} />
                      )}
                      <CollectionsCard group={selectedGroup} canCreate={canCreateCollections} />
                      <FeaturedPlaces group={selectedGroup} />
                    </>
                  </Places>
                )}
                {panel === EPanels.LAYERS && <Layers selected={selectedOpen} />}
              </>
            )}

            {type === LOCATION && <PlaceDetails panel={panel} selected={selectedOpen} />}

            {type === COLLECTION && <CollectionDetails panel={panel} selected={selectedOpen} />}
          </>
        )}

        {newCollectionLayout && <CollectionNew privateGroups={privateGroups} router={router} />}
      </Sidebar>

      <div className="l-content">
        <ErrorBoundary fallbackComponent={<LayerConfigError selectedOpen={selectedOpen} />}>
          <Map page={props.page} selectedOpen={selectedOpen} t={t} activeLayers={activeLayers} />
        </ErrorBoundary>
      </div>
    </main>
  );
};

export default EarthPage;
