import * as React from 'react';
import { useState, useEffect } from 'react';
import { groupBy, isEmpty, map } from 'lodash';
import { JSHINT } from 'jshint';
import { useAuth0 } from 'auth/auth0';
import { AuthzGuards } from 'auth/permissions';
import { encodeQueryToURL, formatDate, stripNumbers } from 'utils';
import { useRequest } from 'utils/hooks';
import { calculateAllForPlace, getPlace, handlePlaceForm } from 'services';
import { MapComponentContext } from 'utils/contexts';

import { PlaceMetrics } from 'components/places/place-metrics';
import { PlaceIntersections } from 'components/places/place-intersections';

import { ContentLayout } from 'layouts';
import { ErrorMessages, ActionModal, MapComponent, LinkWithOrg, JsonEditor, InlineEditCard } from 'components';
import { PlaceTypeEnum } from 'components/places/model';
import { Controller, useForm } from 'react-hook-form';
import { navigate } from 'gatsby';

const INPUT_SIZE_CLASSNAME = 'ng-width-1-1 ng-form-large';
const PLACE_DETAIL_QUERY = {
  include: 'metrics,intersections',
  select: 'intersections.id,intersections.name,intersections.type,-metrics.metric',
  sort: 'intersections.name,metrics.slug,-metrics.version',
};

export default function DetailsPage( path: any ) {
  const { getPermissions, selectedGroup } = useAuth0();
  const encodedQuery = encodeQueryToURL(`locations/${path.page}`, {
    ...PLACE_DETAIL_QUERY,
    group: selectedGroup,
  });

  const { isLoading, errors, data } = useRequest(() => getPlace(encodedQuery), {
    permissions: AuthzGuards.accessPlacesGuard,
    query: encodedQuery,
  });

  console.log(data);

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
    type,
    version,
    metrics,
    intersections,
  } = data;

  const [mapData, setMapData] = useState({});
  const [mappedIntersections, setMappedIntersections] = useState();
  const [geojsonValue, setGeojson] = useState();
  const [jsonError, setJsonError] = useState(false);
  const [serverErrors, setServerErrors] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const writePermissions = getPermissions(AuthzGuards.writePlacesGuard);
  const metricsPermission = getPermissions(AuthzGuards.accessMetricsGuard);
  const writeMetricsPermission = getPermissions(AuthzGuards.writeMetricsGuard);

  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    setMapData({ geojson, bbox: bbox2d });
    setMappedIntersections(groupBy(intersections, 'type'));
  }, [geojson, bbox2d, intersections]);

  const { getValues, register, formState, triggerValidation, control } = useForm({
    mode: 'onChange',
  });

  async function onSubmit( e ) {
    e.preventDefault();

    const formData = getValues();
    try {
      await handlePlaceForm(false, formData, id, selectedGroup);
      // await navigate(`${selectedGroup}/places`);
      await setIsEditing(false);
    } catch (error) {
      setServerErrors(error.data.errors);
    }
  }

  const handleJsonChange = ( json ) => {
    try {
      JSON.parse(json);
    } catch (err) {
      setJsonError(true);
    }
    if (!JSHINT.errors.length) {
      const parsedJson = JSON.parse(json);
      setGeojson(parsedJson);
      setJsonError(false);
      return parsedJson;
    }
    setJsonError(true);
  };


  async function handleCalculateAll( e: MouseEvent, placeID: string ) {
    e.preventDefault();
    e.stopPropagation();
    try {
      setServerErrors(false);
      await calculateAllForPlace(placeID, selectedGroup);
    } catch (error) {
      setServerErrors(error.data.errors);
    }
  }

  function handleServerErrors( errors ) {
    setServerErrors(errors);
  }

  function handleDeleteToggle() {
    setShowDeleteModal(!showDeleteModal);
  }

  return (
    <ContentLayout errors={errors} backTo="/places" isLoading={isLoading}>
      {/*<div>*/}
      {/*  {showDeleteModal && (*/}
      {/*    <ActionModal*/}
      {/*      id={id}*/}
      {/*      navigateRoute={'places'}*/}
      {/*      name={name}*/}
      {/*      toggleModal={handleDeleteToggle}*/}
      {/*      visibility={showDeleteModal}*/}
      {/*    />*/}
      {/*  )}*/}

      <div className="ng-padding-medium">
        <form className="ng-form ng-form-dark ng-flex-column">
          <div className="ng-grid">
            <div className="ng-width-3-4">
              <InlineEditCard
                hasButtons={true}
                saveAction={( e ) => onSubmit(e)}
                validForm={formState.isValid || jsonError}
                serverErrors={serverErrors}
                editForm={( setIsEditing ) => (
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
                      defaultValue={name}
                      placeholder="Place name"
                      className={INPUT_SIZE_CLASSNAME}
                    />
                  </>
                )}>
                <h1 className="ng-text-display-m ng-margin-remove">{name}</h1>
              </InlineEditCard>
            </div>
            <div className="ng-width-1-4">
              <InlineEditCard
                hasButtons={false}
                saveAction={( e ) => onSubmit(e)}
                validForm={formState.isValid || jsonError}
                serverErrors={serverErrors}>
                featured & published
              </InlineEditCard>
            </div>
          </div>
          <div className="ng-grid">
            <div className="ng-width-1-2">
              <InlineEditCard
                hasButtons={true}
                saveAction={( e ) => onSubmit(e)}
                validForm={formState.isValid || jsonError}
                serverErrors={serverErrors}
                editForm={( setIsEditing ) => (
                  <>
                    <div>
                      <label className="ng-form-label" htmlFor="slug">
                        Place slug*
                      </label>
                      <input
                        ref={register({
                          required: true,
                        })}
                        name="slug"
                        type="text"
                        defaultValue={slug}
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
                        defaultValue={type}
                      >
                        {Object.keys(PlaceTypeEnum).map(( t, idx ) => (
                          <option
                            key={idx}
                            value={PlaceTypeEnum[ t ]}
                            selected={type === PlaceTypeEnum[ t ]}
                          >
                            {PlaceTypeEnum[ t ]}
                          </option>
                        ))}
                      </select>
                    </div>

                  </>
                )}>
                <p className="ng-margin-remove">{slug}</p>
                <p className="ng-margin-remove">{type}</p>
              </InlineEditCard>
            </div>
            <div className="ng-width-1-2">
              <InlineEditCard
                hasButtons={false}>
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
              </InlineEditCard>
            </div>
          </div>
          {/*</div>*/}
          {/*<div className="ng-margin-medium-bottom ng-grid">*/}
          {/*<div className="ng-margin-medium-bottom ng-grid">*/}
          {/*  <div className="ng-width-large-1-1 ng-width-1-1">*/}
          {/*    <label className="ng-form-label" htmlFor="description">*/}
          {/*      Place description*/}
          {/*    </label>*/}
          {/*    <textarea*/}
          {/*      ref={register}*/}
          {/*      name="description"*/}
          {/*      defaultValue={description}*/}
          {/*      placeholder="Place description"*/}
          {/*      className={INPUT_SIZE_CLASSNAME}*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*</div>*/}
          {/*<div className="ng-margin-medium-bottom ng-grid">*/}
          {/*  <div className="ng-width-large-1-2 ng-width-1-1">*/}
          {/*    <div className="ng-margin-medium-bottom">*/}
          {/*      <input*/}
          {/*        ref={register}*/}
          {/*        name="featured"*/}
          {/*        id="featured"*/}
          {/*        type="checkbox"*/}
          {/*        defaultChecked={featured}*/}
          {/*        className="ng-margin-right"*/}
          {/*      />*/}
          {/*      <label htmlFor="featured">Featured?</label>*/}
          {/*    </div>*/}

          {/*    <div className="ng-margin-medium-bottom">*/}
          {/*      <input*/}
          {/*        ref={register}*/}
          {/*        name="published"*/}
          {/*        id="published"*/}
          {/*        type="checkbox"*/}
          {/*        defaultChecked={published}*/}
          {/*        className="ng-margin-right"*/}
          {/*      />*/}
          {/*      <label htmlFor="published">Published?</label>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*</div>*/}

          {/*<div className="ng-margin-medium-bottom">*/}
          {/*  {!!geojsonValue && (*/}
          {/*    <Controller*/}
          {/*      name="geojson"*/}
          {/*      control={control}*/}
          {/*      defaultValue={geojsonValue}*/}
          {/*      onChange={( layerConfig ) => handleJsonChange(layerConfig)}*/}
          {/*      as={<JsonEditor json={geojsonValue}/>}*/}
          {/*    />*/}
          {/*  )}*/}
          {/*</div>*/}

          {/*<p>*/}
          {/*  <span className="ng-text-weight-medium">Bbox2d: </span>*/}
          {/*  {bbox2d || '-'}*/}
          {/*</p>*/}
          {/*<p>*/}
          {/*  <span className="ng-text-weight-medium">AreaKm2: </span>*/}
          {/*  {areaKm2 || '-'}*/}
          {/*</p>*/}

          {/*{serverErrors && <ErrorMessages errors={serverErrors}/>}*/}

          {/*<div className="ng-flex">*/}
          {/*  <button*/}
          {/*    className="ng-button ng-button-primary ng-margin-medium-right"*/}
          {/*    onClick={onSubmit}*/}
          {/*    disabled={!formState.isValid || jsonError}*/}
          {/*  >*/}
          {/*    Save*/}
          {/*  </button>*/}

          {/*  <LinkWithOrg className="ng-button ng-button-secondary" to="/places">*/}
          {/*    Cancel*/}
          {/*  </LinkWithOrg>*/}
          {/*</div>*/}
        </form>


        {/*<div className="ng-padding-medium ng-background-ultradkgray ng-margin-medium-bottom">*/}
        {/*  {mappedIntersections &&*/}
        {/*  map(mappedIntersections, ( intersections, idx ) => (*/}
        {/*    <PlaceIntersections*/}
        {/*      key={idx}*/}
        {/*      name={intersections[0].type}*/}
        {/*      intersections={intersections}*/}
        {/*    />*/}
        {/*  ))}*/}
        {/*</div>*/}

        {/*{!isEmpty(geojson) && (*/}
        {/*  <div className="ng-margin-medium-bottom">*/}
        {/*    <MapComponentContext.Provider value={mapData}>*/}
        {/*      <MapComponent/>*/}
        {/*    </MapComponentContext.Provider>*/}
        {/*  </div>*/}
        {/*)}*/}

        {/*{writePermissions && (*/}
        {/*  <LinkWithOrg*/}
        {/*    to={`/places/${id}/edit`}*/}
        {/*    className="ng-button ng-button-primary ng-margin-medium-right"*/}
        {/*  >*/}
        {/*    Edit Place*/}
        {/*  </LinkWithOrg>*/}
        {/*)}*/}
        {/*<LinkWithOrg to="/places" className="ng-button ng-button-secondary">*/}
        {/*  Go back to places list*/}
        {/*</LinkWithOrg>*/}
      </div>

      {/*{metricsPermission && (*/}
      {/*  <div className="ng-padding-medium ng-background-ultradkgray ng-margin-medium-bottom">*/}
      {/*    {metrics && (*/}
      {/*      <div>*/}
      {/*        <h5 className="ng-text-display-s">Place Metrics</h5>*/}
      {/*        <div className="ng-flex ng-flex-wrap">*/}
      {/*          {metrics.map(( metric ) => (*/}
      {/*            <PlaceMetrics*/}
      {/*              key={metric.id}*/}
      {/*              data={metric}*/}
      {/*              handlers={{ handleServerErrors }}*/}
      {/*            />*/}
      {/*          ))}*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*    )}*/}
      {/*    {writeMetricsPermission && (*/}
      {/*      <button*/}
      {/*        className="ng-button ng-button-primary"*/}
      {/*        onClick={( e ) => handleCalculateAll(e, id)}*/}
      {/*      >*/}
      {/*        Recalculate all*/}
      {/*      </button>*/}
      {/*    )}*/}

      {/*    {serverErrors && <ErrorMessages key={id} errors={serverErrors}/>}*/}
      {/*  </div>*/}
      {/*)}*/}
      {/*{writePermissions && (*/}
      {/*  <div className="ng-padding-medium ng-background-ultradkgray ng-text-right">*/}
      {/*    <button className="ng-button ng-button-primary" onClick={handleDeleteToggle}>*/}
      {/*      Delete place*/}
      {/*    </button>*/}
      {/*  </div>*/}
      {/*)}*/}

    </ContentLayout>
  );
}
