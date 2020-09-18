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

import { groupBy, map, noop } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';

import { AuthzGuards } from '@marapp/earth-shared';

import { useAuth0 } from '@app/auth/auth0';
import { Card } from '@app/components/card';
import { DetailList } from '@app/components/detail-list';
import { DownloadFile } from '@app/components/download-file';
import { ErrorBoundary } from '@app/components/error-boundary';
import { ErrorMessages } from '@app/components/error-messages';
import { FakeJsonUpload } from '@app/components/fake-json-upload';
import { InlineEditCard } from '@app/components/inline-edit-card';
import { Input } from '@app/components/input';
import { LinkWithOrg } from '@app/components/link-with-org';
import { MapComponent } from '@app/components/map';
import { DeleteConfirmation } from '@app/components/modals/delete-confirmation';
import { Metrics } from '@app/components/places';
import { Toggle } from '@app/components/toggle';
import { ContentLayout } from '@app/layouts';
import { calculateAllForPlace, getPlace, handlePlaceForm } from '@app/services';
import { encodeQueryToURL, formatArrayToParentheses, formatDate, km2toHa } from '@app/utils';
import { MapComponentContext } from '@app/utils/contexts';
import { noSpecialCharsOrSpaceRule, noSpecialCharsRule, setupErrors } from '@app/utils/validations';

import { PLACE_DETAIL_QUERY, PlaceIntersection, PlaceTypeEnum } from './model';

interface IProps {
  path: string;
  page?: string;
  onDataChange?: () => {};
}

export function PlaceDetail(props: IProps) {
  const { page, onDataChange = noop } = props;
  const { getPermissions, selectedGroup } = useAuth0();
  const writePermissions = getPermissions(AuthzGuards.writePlacesGuard);
  const metricsPermission = getPermissions(AuthzGuards.accessMetricsGuard);
  const writeMetricsPermission = getPermissions(AuthzGuards.writeMetricsGuard);

  const encodedQuery = encodeQueryToURL(`locations/${page}`, {
    ...PLACE_DETAIL_QUERY,
    group: selectedGroup,
  });

  const { data, error, mutate, revalidate } = useSWR(encodedQuery, (url) =>
    getPlace(url).then((response: any) => response.data)
  );

  const [place, setPlace] = useState({});
  const [mapData, setMapData] = useState({});
  const [mappedIntersections, setMappedIntersections] = useState();
  const [geojsonValue, setGeojson] = useState(null);
  const [jsonError, setJsonError] = useState(false);
  const [serverErrors, setServerErrors] = useState();
  const [formValid, setFormValid] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [metricsLoading, setMetricsLoading] = useState(false);

  useEffect(() => {
    data && setPlace(data);
  }, [data]);

  const {
    name,
    geojson,
    id,
    bbox2d,
    intersections,
    featured,
    published,
    type,
    slug,
    metrics,
    centroid,
    areaKm2,
    createdAt,
    updatedAt,
    version,
  } = place;

  const { getValues, register, formState, errors } = useForm({
    mode: 'onChange',
  });

  const { touched, dirty, isValid } = formState;
  const renderErrorFor = setupErrors(errors, touched);

  useEffect(() => {
    place && setMapData({ geojson, bbox: bbox2d });
    place && setMappedIntersections(groupBy(intersections, 'type'));
  }, [place]);

  useEffect(() => {
    setFormValid(isValid);
  }, [isValid]);

  async function onSubmit(e?, setIsEditing?, setIsLoading?, setServerErrors?) {
    e.preventDefault();

    const formData = getValues();

    const parsed = {
      ...formData,
      ...(geojsonValue && { geojson: geojsonValue }),
    };

    try {
      setIsLoading && setIsLoading(true);
      await handlePlaceForm(false, parsed, id, selectedGroup);
      revalidate();
      setIsEditing && setIsEditing(false);
      setIsLoading && setIsLoading(false);
      onDataChange();
    } catch (error) {
      // TODO: Remove this when the real "upload file" feature is available.
      const fallbackError = [
        { detail: 'Something went wrong. Please make sure the selected file is under 6MB.' },
      ];

      setIsLoading && setIsLoading(false);
      setServerErrors && setServerErrors(error?.data.errors || fallbackError);
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

  return (
    !!place && (
      <ContentLayout backTo="/places" isLoading={!data} className="marapp-qa-placesdetail">
        <DeleteConfirmation
          id={id}
          navigateRoute="places"
          type="place"
          name={name}
          toggleModal={handleDeleteToggle}
          onDelete={onDataChange}
          visibility={showDeleteModal}
        />
        <div className="ng-padding-medium-horizontal">
          <LinkWithOrg
            className="marapp-qa-actionreturn ng-border-remove ng-margin-bottom ng-display-block"
            to="/places"
          >
            <i className="ng-icon ng-icon-directionleft" />
            return to places home
          </LinkWithOrg>
          <form className="ng-form ng-form-dark ng-flex-column">
            <div className="ng-grid">
              <div className="ng-width-3-4">
                <InlineEditCard
                  onSubmit={onSubmit}
                  validForm={formValid}
                  render={({ setIsEditing, setIsLoading, setServerErrors }) => (
                    <>
                      <Input
                        name="name"
                        placeholder="Place title"
                        label="Title*"
                        defaultValue={name}
                        className="ng-display-block"
                        error={renderErrorFor('name')}
                        ref={register({
                          required: 'Place title is required',
                          validate: {
                            noSpecialCharsRule: noSpecialCharsRule(),
                          },
                        })}
                      />
                    </>
                  )}
                >
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
                    onChange={onSubmit}
                    ref={register({})}
                  />
                  <Toggle
                    name="published"
                    label="Published"
                    value={published}
                    className="ng-display-block"
                    onChange={onSubmit}
                    ref={register({})}
                  />
                </Card>
              </div>
            </div>
            <div className="ng-grid">
              <div className="ng-width-1-2">
                <InlineEditCard
                  onSubmit={onSubmit}
                  validForm={formValid}
                  render={({ setIsEditing, setIsLoading, setServerErrors }) => (
                    <>
                      <div className="ng-margin-medium-bottom">
                        <Input
                          name="slug"
                          placeholder="Place slug"
                          label="Slug*"
                          defaultValue={slug}
                          className="ng-display-block"
                          error={renderErrorFor('slug')}
                          ref={register({
                            required: 'Place slug is required',
                            validate: {
                              noSpecialCharsOrSpaceRule: noSpecialCharsOrSpaceRule(),
                            },
                          })}
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
                  )}
                >
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
                    <span className="ng-text-weight-bold ng-color-mdgray">Last Updated:</span>{' '}
                    {formatDate(updatedAt)}
                  </p>
                  <p className="ng-margin-bottom ng-margin-top-remove">
                    <span className="ng-text-weight-bold ng-color-mdgray">Created:</span>{' '}
                    {formatDate(createdAt)}
                  </p>
                </Card>
              </div>
            </div>
            <div className="ng-grid">
              {!!mapData && (
                <MapComponentContext.Provider value={mapData}>
                  <div className="ng-margin-medium-bottom ng-width-1-1">
                    <ErrorBoundary>
                      <InlineEditCard
                        editButtonText="View and upload shape"
                        onSubmit={onSubmit}
                        validForm={formValid && !jsonError}
                        render={({ setIsEditing, setIsLoading, setServerErrors }) => (
                          <div className="ng-grid">
                            <div className="ng-width-1-2">
                              <MapComponent height="235px" />
                              <DownloadFile
                                data={geojson}
                                fileName={slug}
                                className="ng-align-right ng-margin-top"
                              >
                                Download GeoJSON
                              </DownloadFile>
                              <div className="ng-width-1-1 ng-margin-medium-top">
                                <FakeJsonUpload
                                  name="geojson"
                                  label="Place shape*"
                                  ref={register({
                                    required: 'GeoJSON is required',
                                  })}
                                  onChange={(json) => {
                                    setGeojson(json);
                                    setJsonError(false);
                                  }}
                                  onError={(err) => setJsonError(true)}
                                />
                              </div>
                            </div>
                            <div className="ng-width-1-2">
                              {areaKm2 && (
                                <p className="ng-margin-bottom ng-margin-top-remove">
                                  <span className="ng-text-weight-bold ng-color-mdgray">
                                    Area ha:
                                  </span>{' '}
                                  {km2toHa(areaKm2)}
                                </p>
                              )}
                              {bbox2d && (
                                <p className="ng-margin-bottom ng-margin-top-remove">
                                  <span className="ng-text-weight-bold ng-color-mdgray">
                                    Area Bbox:
                                  </span>{' '}
                                  {formatArrayToParentheses(bbox2d, 'rounded', 2)}
                                </p>
                              )}
                              {centroid && (
                                <p className="ng-margin-bottom ng-margin-top-remove">
                                  <span className="ng-text-weight-bold ng-color-mdgray">
                                    Centroid:
                                  </span>{' '}
                                  {formatArrayToParentheses(
                                    centroid.geometry.coordinates,
                                    'brackets',
                                    1
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      >
                        <br />
                        <MapComponent />
                      </InlineEditCard>
                    </ErrorBoundary>
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
                        <Metrics key={metric.id} data={metric} handlers={{ handleServerErrors }} />
                      ))}
                    </div>
                  </>
                )}
                {serverErrors && <ErrorMessages key={id} errors={serverErrors} />}
                {writeMetricsPermission && (
                  <button
                    disabled={metricsLoading}
                    className="marapp-qa-actioncalculate ng-button ng-button-primary ng-margin-medium-top"
                    onClick={(e) => handleCalculateAll(e, id)}
                  >
                    Recalculate all
                  </button>
                )}
              </Card>
            )}
          </div>
          {!!intersections && (
            <div className="ng-margin-medium-bottom">
              <Card>
                <div className="">
                  {mappedIntersections &&
                    map(mappedIntersections, (intersections: PlaceIntersection[], idx) => (
                      <DetailList
                        key={idx}
                        name={intersections[0].type}
                        type="places"
                        data={intersections}
                      />
                    ))}
                </div>
              </Card>
            </div>
          )}
        </div>

        {writePermissions && (
          <div className="ng-text-right">
            <button className="ng-button ng-button-secondary" onClick={handleDeleteToggle}>
              Delete place
            </button>
          </div>
        )}
      </ContentLayout>
    )
  );
}
