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

import { PlaceMetricsProps, PLACE_METRICS_VISUAL_MAPPING } from '../model';
import { calculateForPlace } from 'services';
import { AuthzGuards } from 'auth/permissions';
import { useAuth0 } from 'auth/auth0';

import './styles.scss';
import { Auth0Context } from 'utils/contexts';

export default function PlaceMetrics( props: PlaceMetricsProps) {
  const {
    data: { slug, version, place },
    handlers: { handleServerErrors },
  } = props;

  const { selectedGroup } = useContext(Auth0Context);
  const [metricStyle, setMetricStyle] = useState();

  const { getPermissions } = useAuth0();

  const writePermission = getPermissions(AuthzGuards.writeMetricsGuard);

  useEffect(() => {
    const style = PLACE_METRICS_VISUAL_MAPPING[slug] || PLACE_METRICS_VISUAL_MAPPING.default;
    setMetricStyle(style);
  });

  async function handleCalculateSingle(e: MouseEvent, placeID: string, metricId: string) {
    e.preventDefault();
    e.stopPropagation();
    try {
      handleServerErrors(false);
      await calculateForPlace(placeID, metricId, selectedGroup);
    } catch (error) {
      handleServerErrors(error.data.errors);
    }
  }

  return (
    <div className="ng-width-1-4 ng-padding-small ng-margin-small-bottom">
      {!!metricStyle && (
        <div className={`ng-padding-medium ng-border-add ng-height-1-1`}>
          <div className="ng-position-relative">
            <span>
              {slug} <span style={{ fontSize: '10px' }}>v{version}</span>
            </span>
            {writePermission && (
              <button
                className="ng-icon-button ng-recalculate-metrics"
                onClick={(e) => handleCalculateSingle(e, place, slug)}
              >
                <span className="ng-icon ng-icon-spinner" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
