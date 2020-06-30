import * as React from 'react';
import { useState, useEffect, useContext } from 'react';

import { LocationMetricsProps, LOCATION_METRICS_VISUAL_MAPPING } from '../model';
import { calculateForLocation } from 'services';
import { AuthzGuards } from 'auth/permissions';
import { useAuth0 } from 'auth/auth0';

import './styles.scss';
import { Auth0Context } from 'utils/contexts';

export default function LocationMetrics(props: LocationMetricsProps) {
  const {
    data: { slug, version, location },
    handlers: { handleServerErrors },
  } = props;

  const { selectedGroup } = useContext(Auth0Context);
  const [metricStyle, setMetricStyle] = useState();

  const { getPermissions } = useAuth0();

  const writePermission = getPermissions(AuthzGuards.writeMetricsGuard);

  useEffect(() => {
    const style = LOCATION_METRICS_VISUAL_MAPPING[slug] || LOCATION_METRICS_VISUAL_MAPPING.default;
    setMetricStyle(style);
  });

  async function handleCalculateSingle(e: MouseEvent, locationId: string, metricId: string) {
    e.preventDefault();
    e.stopPropagation();
    try {
      handleServerErrors(false);
      await calculateForLocation(locationId, metricId, selectedGroup);
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
                onClick={(e) => handleCalculateSingle(e, location, slug)}
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
