import * as React from 'react';
import { useState, useEffect } from 'react';
import { groupBy, isEmpty, map } from 'lodash';

import { useAuth0 } from 'auth/auth0';
import { AuthzGuards } from 'auth/permissions';
import { encodeQueryToURL, formatDate, stripNumbers } from 'utils';
import { useRequest } from 'utils/hooks';
import { calculateAllForPlace, getPlace } from 'services';
import { MapComponentContext } from 'utils/contexts';

import { PlaceMetrics } from 'pages-client/places/components/place-metrics';
import { PlaceIntersections } from 'pages-client/places/components/place-intersections';

import { ContentLayout } from 'layouts';
import { ErrorMessages, ActionModal, MapComponent, LinkWithOrg } from 'components';

const PLACE_DETAIL_QUERY = {
  include: 'metrics,intersections',
  select: 'intersections.id,intersections.name,intersections.type,-metrics.metric',
  sort: 'intersections.name,metrics.slug,-metrics.version',
};

export default function DetailsPage(path: any) {
  const { getPermissions, selectedGroup } = useAuth0();
  const encodedQuery = encodeQueryToURL(`locations/${path.page}`, {
    ...PLACE_DETAIL_QUERY,
    group: selectedGroup,
  });

  const { isLoading, errors, data } = useRequest(() => getPlace(encodedQuery), {
    permissions: AuthzGuards.accessPlacesGuard,
    query: encodedQuery,
  });

  const {
    id,
    slug,
    name,
    description,
    geojson,
    published,
    featured,
    bbox2d,
    areaKm2,
    createdAt,
    updatedAt,
    version,
    metrics,
    intersections,
  } = data;

  const publishIcon = published ? 'check' : 'close';
  const featuredIcon = featured ? 'check' : 'close';

  const [mapData, setMapData] = useState({});
  const [mappedIntersections, setMappedIntersections] = useState();
  const [serverErrors, setServerErrors] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const writePermissions = getPermissions(AuthzGuards.writePlacesGuard);
  const metricsPermission = getPermissions(AuthzGuards.accessMetricsGuard);
  const writeMetricsPermission = getPermissions(AuthzGuards.writeMetricsGuard);

  useEffect(() => {
    setMapData({ geojson, bbox: bbox2d });
    setMappedIntersections(groupBy(intersections, 'type'));
  }, [geojson, bbox2d, intersections]);

  async function handleCalculateAll(e: MouseEvent, placeID: string) {
    e.preventDefault();
    e.stopPropagation();
    try {
      setServerErrors(false);
      await calculateAllForPlace(placeID, selectedGroup);
    } catch (error) {
      setServerErrors(error.data.errors);
    }
  }

  function handleServerErrors(errors) {
    setServerErrors(errors);
  }

  function handleDeleteToggle() {
    setShowDeleteModal(!showDeleteModal);
  }

  return (
    <ContentLayout errors={errors} backTo="/places" isLoading={isLoading}>

      <div>
        {showDeleteModal && (
          <ActionModal
            id={id}
            navigateRoute={'places'}
            name={name}
            toggleModal={handleDeleteToggle}
            visibility={showDeleteModal}
          />
        )}
        <div className="ng-flex ng-flex-space-between">
          <h2 className="ng-text-display-m ng-c-flex-grow-1">{name}</h2>
          <div className="ng-flex ng-align-center ng-flex-center ng-text-center ng-center">
            <span className="ng-padding-horizontal">
              Published
            <br />
              <i className={`ng-icon-${publishIcon}`}></i>
            </span>
            <span className="ng-padding-horizontal">
              Featured
            <br />
              <i className={`ng-icon-${featuredIcon}`}></i>
            </span>
          </div>
        </div>

        <div className="ng-padding-medium ng-background-ultradkgray ng-margin-medium-bottom">
          <h3 className="ng-text-display-s">
            Place details for {name} version{version}
          </h3>
          <p>
            <span className="ng-text-weight-medium">Created at:</span> {formatDate(createdAt)}
          </p>
          <p>
            <span className="ng-text-weight-medium">Last updated at:</span> {formatDate(updatedAt)}
          </p>
          <p>
            <span className="ng-text-weight-medium">Description:</span> {description || '-'}
          </p>
          <p>
            <span className="ng-text-weight-medium">Slug:</span> {slug || '-'}
          </p>
          <p>
            <span className="ng-text-weight-medium">AreaKm2:</span> {stripNumbers(areaKm2)}
          </p>

          {!isEmpty(geojson) && (
            <div className="ng-margin-medium-bottom">
              <MapComponentContext.Provider value={mapData}>
                <MapComponent />
              </MapComponentContext.Provider>
            </div>
          )}

          {writePermissions && (
            <LinkWithOrg
              to={`/places/${id}/edit`}
              className="ng-button ng-button-primary ng-margin-medium-right"
            >
              Edit Place
            </LinkWithOrg>
          )}
          <LinkWithOrg to="/places" className="ng-button ng-button-secondary">
            Go back to places list
        </LinkWithOrg>
        </div>
        <div className="ng-padding-medium ng-background-ultradkgray ng-margin-medium-bottom">
          {mappedIntersections &&
            map(mappedIntersections, (intersections, idx) => (
              <PlaceIntersections
                key={idx}
                name={intersections[0].type}
                intersections={intersections}
              />
            ))}
        </div>
        {metricsPermission && (
          <div className="ng-padding-medium ng-background-ultradkgray ng-margin-medium-bottom">
            {metrics && (
              <div>
                <h5 className="ng-text-display-s">Place Metrics</h5>
                <div className="ng-flex ng-flex-wrap">
                  {metrics.map((metric) => (
                    <PlaceMetrics
                      key={metric.id}
                      data={metric}
                      handlers={{ handleServerErrors }}
                    />
                  ))}
                </div>
              </div>
            )}
            {writeMetricsPermission && (
              <button
                className="ng-button ng-button-primary"
                onClick={(e) => handleCalculateAll(e, id)}
              >
                Recalculate all
              </button>
            )}

            {serverErrors && <ErrorMessages key={id} errors={serverErrors} />}
          </div>
        )}
        {writePermissions && (
          <div className="ng-padding-medium ng-background-ultradkgray ng-text-right">
            <button className="ng-button ng-button-primary" onClick={handleDeleteToggle}>
              Delete place
          </button>
          </div>
        )}
      </div>

    </ContentLayout>
  );
}