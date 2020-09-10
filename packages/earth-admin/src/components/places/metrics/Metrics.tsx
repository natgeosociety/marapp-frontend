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

import * as React from 'react';
import { useState, useEffect, useContext } from 'react';

import { PlaceMetricsProps } from '../../../pages-client/places/model';
import { calculateForPlace } from 'services';
import { AuthzGuards } from 'auth/permissions';
import { useAuth0 } from 'auth/auth0';

import './styles.scss';
import { Auth0Context } from 'utils/contexts';

export default function Metrics(props: PlaceMetricsProps) {
  const {
    data: {slug, version, location},
    handlers: {handleServerErrors},
  } = props;

  const [loading, setLoading] = useState(false);

  const {selectedGroup} = useContext(Auth0Context);

  const {getPermissions} = useAuth0();

  const writePermission = getPermissions(AuthzGuards.writeMetricsGuard);


  async function handleCalculateSingle(e: MouseEvent, placeID: string, metricId: string) {
    e.preventDefault();
    e.stopPropagation();
    try {
      handleServerErrors(false);
      await calculateForPlace(placeID, metricId, selectedGroup);
      setLoading(true)
    } catch (error) {
      handleServerErrors(error.data.errors);
    }
  }

  return (
    <div className="marapp-qa-placemetrics ng-width-1-4 ng-padding-small">
      <div style={{"minHeight": '50px'}} className="ng-padding-medium-horizontal ng-padding-vertical ng-background-dkgray ng-height-1-1 ng-flex ng-flex-space-between">
        <div className="ng-flex-middle ng-flex">
                <span>
              {slug}
            </span>
        </div>
        <div className="ng-position-relative ng-flex ng-flex-column ng-flex-space-between ng-text-center">
          {writePermission && (
            <button
              disabled={loading}
              className="marapp-qa-actionrecalculate ng-icon-button ng-recalculate-metrics"
              onClick={(e) => handleCalculateSingle(e, location, slug)}
            >
              <span className="ng-icon ng-icon-reload"/>
            </button>
          )}
          <span>v{version}</span>
        </div>
      </div>

    </div>
  );
}
