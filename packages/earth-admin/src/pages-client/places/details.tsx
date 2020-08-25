import * as React from 'react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { groupBy, map } from 'lodash';
import { useAuth0 } from 'auth/auth0';
import { AuthzGuards } from 'auth/permissions';
import { encodeQueryToURL, formatDate, km2toHa, formatArrayToParentheses } from 'utils';
import { useRequest } from 'utils/hooks';
import { calculateAllForPlace, getPlace, handlePlaceForm } from 'services';
import { MapComponentContext } from 'utils/contexts';
import {
  PlaceMetrics, PlaceIntersections, ErrorMessages,
  ActionModal,
  MapComponent,
  InlineEditCard,
  Toggle, FakeJsonUpload, Card, Input, LinkWithOrg,
} from 'components';

import { ContentLayout } from 'layouts';
import { PlaceTypeEnum, PLACE_DETAIL_QUERY } from './model';


export function PlaceDetail(path: any) {
  const {getPermissions, selectedGroup} = useAuth0();
  const writePermissions = getPermissions(AuthzGuards.writePlacesGuard);
  const metricsPermission = getPermissions(AuthzGuards.accessMetricsGuard);
  const writeMetricsPermission = getPermissions(AuthzGuards.writeMetricsGuard);

  const encodedQuery = encodeQueryToURL(`locations/${path.page}`, {
    ...PLACE_DETAIL_QUERY,
    group: selectedGroup,
  });

  const {isLoading, data} = useRequest(() => getPlace(encodedQuery), {
    permissions: AuthzGuards.accessPlacesGuard,
    query: encodedQuery,
  });

  const [place, setPlace] = useState(data);
  const [mapData, setMapData] = useState({});
  const [mappedIntersections, setMappedIntersections] = useState();
  const [geojsonValue, setGeojson] = useState();
  const [jsonError, setJsonError] = useState(false);
  const [serverErrors, setServerErrors] = useState();
  const [formValid, setFormValid] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [metricsLoading, setMetricsLoading] = useState(false);

  useEffect(() => {
    setPlace(data);
  }, [data]);

  const {
    name, geojson, id, bbox2d, intersections, featured, published, type, slug, metrics,
    centroid, areaKm2, createdAt, updatedAt, version,
  } = place;


  const {getValues, register, formState, errors} = useForm({
    mode: 'onChange',
  });

  const {touched, dirty, isValid} = formState;

  useEffect(() => {
    place && setMapData({geojson: geojson, bbox: bbox2d});
    place && setMappedIntersections(groupBy(intersections, 'type'));
  }, [place]);

  useEffect(() => {
    setFormValid(isValid);
  }, [isValid])

  async function onSubmit(e?, setIsEditing?, setIsLoading?, setServerErrors?) {
    e.preventDefault();

    const formData = getValues();
    const parsed = {
      ...formData,
      geojson: geojsonValue,
    };

    try {
      setIsLoading && setIsLoading(true);
      await handlePlaceForm(false, parsed, id, selectedGroup);
      const res = await getPlace(encodedQuery);
      setPlace(res.data);
      setIsLoading && setIsLoading(false);
      setIsEditing && setIsEditing(false);
    } catch (error) {
      setIsLoading && setIsLoading(false);
      setServerErrors && setServerErrors(error.data.errors);
    }
  }

  async function handleCalculateAll(e: MouseEvent, placeID: string) {
    e.preventDefault();
    e.stopPropagation();
    try {
      setServerErrors(false);
      await calculateAllForPlace(placeID, selectedGroup);
      setMetricsLoading(true);
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

  return !!place && <ContentLayout backTo="/places" isLoading={isLoading}>
    {showDeleteModal && (
      <ActionModal
        id={id}
        navigateRoute={'places'}
        name={name}
        toggleModal={handleDeleteToggle}
        visibility={showDeleteModal}
      />
    )}
    <div className="ng-padding-medium-horizontal">
      <LinkWithOrg className="ng-border-remove ng-margin-medium-bottom ng-display-block" to="/places">
        <i className="ng-icon ng-icon-directionleft"></i>
        return to places home
      </LinkWithOrg>
      <form className="ng-form ng-form-dark ng-flex-column">
        <div className="ng-grid">
          <div className="ng-width-3-4">
            <InlineEditCard
              onSubmit={onSubmit}
              validForm={formValid}
              render={({setIsEditing, setIsLoading, setServerErrors}) => (
                <>
                  <Input
                    name="name"
                    placeholder="Place title"
                    label="Title*"
                    defaultValue={name}
                    className="ng-display-block"
                    error={touched.name && errors.name && errors.name.message}
                    ref={register({
                      required: 'Place title is required',
                    })}/>
                </>
              )}>
              <h1 className="ng-text-display-m ng-margin-remove">{name}</h1>
            </InlineEditCard>
          </div>
          <div className="ng-width-1-4">
            <Card>
              <Toggle
                name="featured"
                label="Featured"
                value={featured}
                className="ng-display-block"
                onChange={(e) => onSubmit(e)}
                ref={register({})}/>
              <Toggle
                name="published"
                label="Published"
                value={published}
                className="ng-display-block"
                onChange={(e) => onSubmit(e)}
                ref={register({})}/>
            </Card>
          </div>
        </div>
        <div className="ng-grid">
          <div className="ng-width-1-2">
            <InlineEditCard
              onSubmit={onSubmit}
              validForm={formValid}
              render={({setIsEditing, setIsLoading, setServerErrors}) => (
                <>
                  <div className="ng-margin-medium-bottom">
                    <Input
                      name="slug"
                      placeholder="Place slug"
                      label="Slug*"
                      defaultValue={slug}
                      error={touched.slug && errors.slug && errors.slug.message}
                      className="ng-display-block"
                      ref={register({
                        required: 'Place slug is required',
                      })}/>
                  </div>
                  <div>
                    <label htmlFor="type">Place type</label>
                    <select
                      className="ng-width-1-1 ng-form-large"
                      id="type"
                      ref={register({
                        required: true,
                      })}
                      name="type"
                      defaultValue={type}
                    >
                      {Object.keys(PlaceTypeEnum).map((t, idx) => (
                        <option
                          key={idx}
                          value={PlaceTypeEnum[t]}
                          selected={type === PlaceTypeEnum[t]}
                        >
                          {PlaceTypeEnum[t]}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}>
              <div className="ng-margin-medium-bottom">
                <p className="ng-text-weight-bold ng-margin-remove">Place slug</p>
                <p className="ng-margin-remove ng-padding-left">{slug}</p>
              </div>
              <div>
                <p className="ng-text-weight-bold ng-margin-remove">Place type</p>
                <p className="ng-margin-remove ng-padding-left">{type}</p>
              </div>
            </InlineEditCard>
          </div>
          <div className="ng-width-1-2">
            <Card>
              <p className="ng-margin-bottom ng-margin-top-remove">
                <span className="ng-text-weight-bold ng-color-mdgray">ID:</span> {id}
              </p>
              <p className="ng-margin-bottom ng-margin-top-remove">
                <span className="ng-text-weight-bold ng-color-mdgray">Version:</span> {version}
              </p>
              <p className="ng-margin-bottom ng-margin-top-remove">
                <span className="ng-text-weight-bold ng-color-mdgray">Last Updated:</span> {formatDate(updatedAt)}
              </p>
              <p className="ng-margin-bottom ng-margin-top-remove">
                <span className="ng-text-weight-bold ng-color-mdgray">Created:</span> {formatDate(createdAt)}
              </p>
            </Card>
          </div>
        </div>
        <div className="ng-grid">
          {!!mapData && (
            <MapComponentContext.Provider value={mapData}>
              <div className="ng-margin-medium-bottom ng-width-1-1">
                <InlineEditCard
                  editButtonText="View and upload shape"
                  onSubmit={onSubmit}
                  validForm={formValid}
                  render={({setIsEditing, setIsLoading, setServerErrors}) => (
                    <div className="ng-grid">
                      <div className="ng-width-1-2">
                        <MapComponent height="235px"/>
                        <button
                          className="ng-button ng-button-link ng-align-right ng-margin-top">Download
                          geojson
                        </button>
                        <div className="ng-width-1-1 ng-margin-medium-top">
                          <FakeJsonUpload
                            name="geojson"
                            label="Place shape*"
                            ref={register({
                              required: 'GeoJSON is required',
                            })}
                            onChange={(json) => setGeojson(json)}
                            onError={(err) => setJsonError(err)}/>
                        </div>
                      </div>
                      <div className="ng-width-1-2">
                        {areaKm2 && <p className="ng-margin-bottom ng-margin-top-remove">
                                          <span
                                            className="ng-text-weight-bold ng-color-mdgray">Area ha:</span> {km2toHa(areaKm2)}
                        </p>}
                        {bbox2d && <p className="ng-margin-bottom ng-margin-top-remove">
                                          <span
                                            className="ng-text-weight-bold ng-color-mdgray">Area Bbox:</span> {formatArrayToParentheses(bbox2d, 'rounded', 2)}
                        </p>}
                        {centroid && <p className="ng-margin-bottom ng-margin-top-remove">
                                          <span
                                            className="ng-text-weight-bold ng-color-mdgray">Centroid:</span> {formatArrayToParentheses(centroid.geometry.coordinates, 'brackets', 1)}
                        </p>}
                      </div>
                    </div>
                  )}>
                  <br/>
                  <MapComponent/>
                </InlineEditCard>
              </div>
            </MapComponentContext.Provider>
          )}
        </div>
      </form>

      <div className="ng-margin-medium-bottom">
        {metricsPermission && (
          <Card>
            {metrics && (
              <>
                <p className="ng-text-weight-bold ng-margin-small-bottom">Place Metrics</p>
                <div className="ng-flex ng-flex-wrap ng-place-metrics-container">
                  {metrics.map((metric) => (
                    <PlaceMetrics
                      key={metric.id}
                      data={metric}
                      handlers={{handleServerErrors}}
                    />
                  ))}
                </div>
              </>
            )}
            {serverErrors && <ErrorMessages key={id} errors={serverErrors}/>}
            {writeMetricsPermission && (
              <button
                disabled={metricsLoading}
                className="ng-button ng-button-primary ng-margin-medium-top"
                onClick={(e) => handleCalculateAll(e, id)}
              >
                Recalculate all
              </button>
            )}
          </Card>
        )}
      </div>
      {!!intersections && <div className="ng-margin-medium-bottom">
        <Card>
          <div className="">
            {mappedIntersections &&
            map(mappedIntersections, (intersections, idx) => (
              <PlaceIntersections
                key={idx}
                name={intersections[0].type}
                intersections={intersections}
              />
            ))}
          </div>
        </Card>
      </div>}
      {writePermissions && (
        <div className="ng-text-right">
          <button className="ng-button ng-button-secondary" onClick={handleDeleteToggle}>
            Delete place
          </button>
        </div>
      )}
    </div>
  </ContentLayout>;
}
