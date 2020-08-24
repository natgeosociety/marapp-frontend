import * as React from 'react';
import { useState, useEffect } from 'react';
import { groupBy, isEmpty, map } from 'lodash';
import { JSHINT } from 'jshint';
import { useAuth0 } from 'auth/auth0';
import { AuthzGuards } from 'auth/permissions';
import { encodeQueryToURL, formatDate, stripNumbers, km2toHa, formatArrayToParanthesis } from 'utils';
import { useRequest } from 'utils/hooks';
import { calculateAllForPlace, getPlace, handlePlaceForm } from 'services';
import { MapComponentContext } from 'utils/contexts';

import { PlaceMetrics } from 'components/places/place-metrics';
import { PlaceIntersections } from 'components/places/place-intersections';

import { ContentLayout } from 'layouts';
import {
  ErrorMessages,
  ActionModal,
  MapComponent,
  LinkWithOrg,
  JsonEditor,
  InlineEditCard,
  InlineCardButtons,
  Toggle, FakeJsonUpload,
} from 'components';
import { PlaceTypeEnum } from './model';
import { Controller, useForm } from 'react-hook-form';
import { navigate } from 'gatsby';

const INPUT_SIZE_CLASSNAME = 'ng-width-1-1 ng-form-large';
const PLACE_DETAIL_QUERY = {
  include: 'metrics,intersections',
  select: 'intersections.id,intersections.name,intersections.type,-metrics.metric',
  sort: 'intersections.name,metrics.slug,-metrics.version',
};

export function PlaceDetail(path: any) {
  const {getPermissions, selectedGroup} = useAuth0();
  const writePermissions = getPermissions(AuthzGuards.writePlacesGuard);
  const metricsPermission = getPermissions(AuthzGuards.accessMetricsGuard);
  const writeMetricsPermission = getPermissions(AuthzGuards.writeMetricsGuard);

  const encodedQuery = encodeQueryToURL(`locations/${path.page}`, {
    ...PLACE_DETAIL_QUERY,
    group: selectedGroup,
  });

  const [place, setPlace] = useState(null);

  const {isLoading, errors, data} = useRequest(() => getPlace(encodedQuery), {
    permissions: AuthzGuards.accessPlacesGuard,
    query: encodedQuery,
  });

  useEffect(() => {
    setPlace(data);
  }, [data]);


  const [mapData, setMapData] = useState({});
  const [mappedIntersections, setMappedIntersections] = useState();
  const [geojsonValue, setGeojson] = useState();
  const [jsonError, setJsonError] = useState(false);
  const [serverErrors, setServerErrors] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {getValues, register, formState, triggerValidation, control} = useForm({
    mode: 'onChange',
  });

  useEffect(() => {
    place && setMapData({geojson: place.geojson, bbox: place.bbox2d});
    console.log(place);
    place && setMappedIntersections(groupBy(place.intersections, 'type'));
  }, [place]);


  async function onSubmit(e, setIsEditing?, setIsLoading?, setServerErrors?) {
    e.preventDefault();
    const formData = getValues();

    const parsed = {
      ...formData,
      geojson: geojsonValue,
    }

    try {
      setIsLoading(true);
      await handlePlaceForm(false, parsed, place.id, selectedGroup);
      const res = await getPlace(encodedQuery);
      setPlace(res.data);
      setIsLoading(false);
      setIsEditing(false);
    } catch (error) {
      setIsLoading(false);
      setServerErrors(error.data.errors);
    }
  }

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

  const handleFlagChange = (val) => {
    console.log(val, 'clock');
  };

  return !!place && <ContentLayout errors={errors} backTo="/places" isLoading={isLoading}>
    {showDeleteModal && (
      <ActionModal
        id={place.id}
        navigateRoute={'places'}
        name={place.name}
        toggleModal={handleDeleteToggle}
        visibility={showDeleteModal}
      />
    )}
    <div className="ng-padding-medium">
      <form className="ng-form ng-form-dark ng-flex-column">
        <div className="ng-grid">
          <div className="ng-width-3-4">
            <InlineEditCard
              render={({setIsEditing, setIsLoading, setServerErrors}) => (
                <>
                  <label className="ng-form-label" htmlFor="name">
                    Place title*
                  </label>
                  <input
                    ref={register({
                      required: true,
                    })}
                    name="name"
                    type="text"
                    defaultValue={place.name}
                    placeholder="Place name"
                    className={INPUT_SIZE_CLASSNAME}
                  />
                  <InlineCardButtons
                    submitButtonText="Save"
                    cancelButtonText="Cancel"
                    cancelAction={(e) => setIsEditing(false)}
                    submitAction={(e) => onSubmit(e, setIsEditing, setIsLoading, setServerErrors)}/>
                </>
              )}>
              <h1 className="ng-text-display-m ng-margin-remove">{place.name}</h1>
            </InlineEditCard>
          </div>
          <div className="ng-width-1-4">
            <InlineEditCard>
              <Controller
                name="featured"
                control={control}
                defaultValue={place.featured}
                as={
                <div>
                  Featured
                  <Toggle className="ng-margin-right" active={place.featured === true}/>
                </div>}
              />
            </InlineEditCard>
          </div>
        </div>
        <div className="ng-grid">
          <div className="ng-width-1-2">
            <InlineEditCard
              render={({setIsEditing, setIsLoading, setServerErrors}) => (
                <>
                  <div className="ng-margin-medium-bottom">
                    <label className="ng-form-label" htmlFor="slug">
                      Place slug*
                    </label>
                    <input
                      ref={register({
                        required: true,
                      })}
                      name="slug"
                      type="text"
                      defaultValue={place.slug}
                      placeholder="Place slug"
                      className={INPUT_SIZE_CLASSNAME}
                    />
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
                      defaultValue={place.type}
                    >
                      {Object.keys(PlaceTypeEnum).map((t, idx) => (
                        <option
                          key={idx}
                          value={PlaceTypeEnum[t]}
                          selected={place.type === PlaceTypeEnum[t]}
                        >
                          {PlaceTypeEnum[t]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <InlineCardButtons
                    submitButtonText="Save"
                    cancelButtonText="Cancel"
                    cancelAction={(e) => setIsEditing(false)}
                    submitAction={(e) => onSubmit(e, setIsEditing, setIsLoading, setServerErrors)}/>
                </>
              )}>
              <div className="ng-margin-medium-bottom">
                <p className="ng-text-weight-bold ng-margin-remove">Place slug</p>
                <p className="ng-margin-remove ng-padding-left">{place.slug}</p>
              </div>
              <div>
                <p className="ng-text-weight-bold ng-margin-remove">Place type</p>
                <p className="ng-margin-remove ng-padding-left">{place.type}</p>
              </div>
            </InlineEditCard>
          </div>
          <div className="ng-width-1-2">
            <InlineEditCard
              hasButtons={false}>
              <p className="ng-margin-bottom ng-margin-top-remove">
                <span className="ng-text-weight-bold ng-color-mdgray">ID:</span> {place.id}
              </p>
              <p className="ng-margin-bottom ng-margin-top-remove">
                <span className="ng-text-weight-bold ng-color-mdgray">Version:</span> {place.version}
              </p>
              <p className="ng-margin-bottom ng-margin-top-remove">
                <span className="ng-text-weight-bold ng-color-mdgray">Last Updated:</span> {formatDate(place.updatedAt)}
              </p>
              <p className="ng-margin-bottom ng-margin-top-remove">
                <span className="ng-text-weight-bold ng-color-mdgray">Created:</span> {formatDate(place.createdAt)}
              </p>
            </InlineEditCard>
          </div>
        </div>
        <div className="ng-grid">
          {!!mapData && (
            <MapComponentContext.Provider value={mapData}>
              <div className="ng-margin-medium-bottom ng-width-1-1">
                <InlineEditCard
                  editButtonText="View and upload shape"
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
                          onError={(err) => setJsonError(err)} />
                      </div>
                    </div>
                    <div className="ng-width-1-2">
                      {place.areaKm2 && <p className="ng-margin-bottom ng-margin-top-remove">
                                          <span
                                            className="ng-text-weight-bold ng-color-mdgray">Area ha:</span> {km2toHa(place.areaKm2)}
                      </p>}
                      {place.bbox2d && <p className="ng-margin-bottom ng-margin-top-remove">
                                          <span
                                            className="ng-text-weight-bold ng-color-mdgray">Area Bbox:</span> {formatArrayToParanthesis(place.bbox2d, 'rounded', 2)}
                      </p>}
                      {place.centroid && <p className="ng-margin-bottom ng-margin-top-remove">
                                          <span
                                            className="ng-text-weight-bold ng-color-mdgray">Centroid:</span> {formatArrayToParanthesis(place.centroid.geometry.coordinates, 'brackets', 1)}
                      </p>}
                    </div>
                    <InlineCardButtons
                      submitButtonText="Update shape"
                      cancelButtonText="Cancel"
                      cancelAction={(e) => setIsEditing(false)}
                      submitAction={(e) => onSubmit(e, setIsEditing, setIsLoading, setServerErrors)}/>
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
        <InlineEditCard hasButtons={false}>
          {metricsPermission && (
            <div>
              {place.metrics && (
                <div>
                  <h5 className="ng-text-display-s">Place Metrics</h5>
                  <div className="ng-flex ng-flex-wrap ng-place-metrics-container">
                    {place.metrics.map((metric) => (
                      <PlaceMetrics
                        key={metric.id}
                        data={metric}
                        handlers={{handleServerErrors}}
                      />
                    ))}
                  </div>
                </div>
              )}
              {writeMetricsPermission && (
                <button
                  className="ng-button ng-button-primary"
                  onClick={(e) => handleCalculateAll(e, place.id)}
                >
                  Recalculate all
                </button>
              )}

              {serverErrors && <ErrorMessages key={place.id} errors={serverErrors}/>}
            </div>
          )}
        </InlineEditCard>
      </div>
      {!!place.intersections && <div className="ng-margin-medium-bottom">
        <InlineEditCard hasButtons={false}>
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
        </InlineEditCard>
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
