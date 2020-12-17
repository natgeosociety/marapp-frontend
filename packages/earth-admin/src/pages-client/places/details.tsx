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
import { merge } from 'lodash/fp';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';

import {
  AuthzGuards,
  Card,
  ErrorBoundary,
  ErrorMessages,
  InlineEditCard,
  Input,
  noSpecialCharsOrSpaceRule,
  setupErrors,
  Tab,
  Tabs,
} from '@marapp/earth-shared';

import { useAuth0 } from '@app/auth/auth0';
import { DetailList } from '@app/components/detail-list';
import { DownloadFile } from '@app/components/download-file';
import { FakeJsonUpload } from '@app/components/fake-json-upload';
import { JsonEditor } from '@app/components/json-editor';
import { LinkWithOrg } from '@app/components/link-with-org';
import { MapComponent } from '@app/components/map';
import { DeleteConfirmation } from '@app/components/modals/delete-confirmation';
import { Metrics } from '@app/components/places';
import { Toggle } from '@app/components/toggle';
import { PUBLIC_ORG } from '@app/config';
import { ContentLayout } from '@app/layouts';
import { generateCacheKey } from '@app/services';
import MetricService from '@app/services/metrics';
import PlacesService from '@app/services/places';
import { formatArrayToParentheses, formatDate, km2toHa } from '@app/utils';
import { MapComponentContext } from '@app/utils/contexts';

import { IPlace, PLACE_DETAIL_QUERY, PlaceIntersection } from './model';

interface IProps {
  path: string;
  page?: string;
  onDataChange?: () => {};
  dynamicOptions?: {
    type?: any[];
  };
}

export function PlaceDetail(props: IProps) {
  const { page, onDataChange = noop, dynamicOptions } = props;
  const { type: placeTypeOptions = [] } = dynamicOptions;
  const { getPermissions, selectedGroup } = useAuth0();
  const { t } = useTranslation('admin');
  const writePermissions = getPermissions(AuthzGuards.writePlacesGuard);
  const metricsPermission = getPermissions(AuthzGuards.accessMetricsGuard);
  const writeMetricsPermission = getPermissions(AuthzGuards.writeMetricsGuard);

  const query = merge(PLACE_DETAIL_QUERY, { group: selectedGroup });
  const cacheKey = generateCacheKey(`locations/${page}`, query);

  const fetcher = () => PlacesService.getPlace(page, query).then((response: any) => response.data);
  const setter = (data) =>
    PlacesService.handlePlaceForm(false, data, id, query).then((response: any) => response.data);

  const { data, error, revalidate, mutate } = useSWR(cacheKey, fetcher);

  const [place, setPlace] = useState<IPlace>({});
  const [mapData, setMapData] = useState({});
  const [mappedIntersections, setMappedIntersections] = useState();
  const [geojsonValue, setGeojson] = useState(null);
  const [jsonError, setJsonError] = useState(false);
  const [serverErrors, setServerErrors] = useState();
  const [formValid, setFormValid] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [panel, setPanel] = useState('upload');

  const switchGeojsonTab = (e) => {
    setPanel(e);
    setGeojson(geojsonValue);
    setJsonError(true);
  };

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
    publicResource,
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
      publicResource: formData.publicResource && formData.published,
    };

    try {
      setIsLoading && setIsLoading(true);

      await mutate(await setter(parsed), false);

      setIsEditing && setIsEditing(false);
      setIsLoading && setIsLoading(false);
      setPanel('upload');
      await onDataChange();
    } catch (error) {
      // TODO: Remove this when the real "upload file" feature is available.
      const fallbackError = [
        {
          detail: `${t(
            'Something went wrong'
          )}. ${t('Please make sure the selected file is under MB', { value: 6 })}`,
        },
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
      await MetricService.calculateAllForPlace(placeID, { group: selectedGroup });
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
      <ContentLayout
        backTo="/places"
        isLoading={!data && !error}
        errorPage="place"
        errors={error?.data?.errors}
        className="marapp-qa-placesdetail"
      >
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
            className="marapp-qa-actionreturn ng-border-remove ng-margin-bottom ng-display-inline-block"
            to="/places"
          >
            <i className="ng-icon ng-icon-directionleft" />
            {t('return to home', { value: 'places' })}
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
                        placeholder={t('Place title')}
                        label="Title"
                        required={true}
                        defaultValue={name}
                        className="ng-display-block"
                        error={renderErrorFor('name')}
                        ref={register({
                          required: 'Place title is required',
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
                  {PUBLIC_ORG === selectedGroup && published && (
                    <Toggle
                      name="publicResource"
                      label="Public"
                      value={publicResource}
                      className="ng-display-block"
                      onChange={onSubmit}
                      ref={register({})}
                    />
                  )}
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
                          placeholder={t('Place slug')}
                          label="Slug"
                          required={true}
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
                        <label htmlFor="type">{t('Place type')}</label>
                        <select
                          className="ng-width-1-1 ng-form-large"
                          id="type"
                          ref={register({
                            required: true,
                          })}
                          name="type"
                          defaultValue={type}
                        >
                          {placeTypeOptions.map((pt) => (
                            <option key={pt.value} value={pt.value} selected={type === pt.value}>
                              {pt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                >
                  <div className="ng-margin-medium-bottom">
                    <p className="ng-text-weight-bold ng-margin-remove">{t('Place slug')}</p>
                    <p className="ng-margin-remove ng-padding-left">{slug}</p>
                  </div>
                  <div>
                    <p className="ng-text-weight-bold ng-margin-remove">{t('Place type')}</p>
                    <p className="ng-margin-remove ng-padding-left">{type}</p>
                  </div>
                </InlineEditCard>
              </div>
              <div className="ng-width-1-2">
                <Card>
                  <p className="ng-margin-bottom ng-margin-top-remove">
                    <span className="ng-text-weight-bold ng-color-mdgray">{t('ID')}:</span> {id}
                  </p>
                  <p className="ng-margin-bottom ng-margin-top-remove">
                    <span className="ng-text-weight-bold ng-color-mdgray">{t('Version')}:</span>{' '}
                    {version}
                  </p>
                  <p className="ng-margin-bottom ng-margin-top-remove">
                    <span className="ng-text-weight-bold ng-color-mdgray">
                      {t('Last Updated')}:
                    </span>{' '}
                    {formatDate(updatedAt)}
                  </p>
                  <p className="ng-margin-bottom ng-margin-top-remove">
                    <span className="ng-text-weight-bold ng-color-mdgray">{t('Created')}:</span>{' '}
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
                        editButtonText={t('View and upload shape')}
                        onSubmit={onSubmit}
                        onCancel={() => [setPanel('upload'), setGeojson(null)]}
                        submitButtonText={t('Update Shape')}
                        validForm={formValid && !jsonError}
                        render={({ setIsEditing, setIsLoading, setServerErrors }) => (
                          <>
                            <Tabs
                              value={panel}
                              onChange={switchGeojsonTab}
                              className="ng-ep-background-dark"
                            >
                              <Tab label={t('Shape File')} value="upload" />
                              <Tab label={t('Json editor')} value="json" />
                            </Tabs>
                            {panel === 'upload' && (
                              <div className="ng-grid">
                                <div className="ng-width-1-2">
                                  <MapComponent height="235px" />
                                  <DownloadFile
                                    data={geojson}
                                    fileName={slug}
                                    type="geojson"
                                    className="ng-align-right ng-margin-top"
                                  >
                                    {t('Download GeoJSON')}
                                  </DownloadFile>
                                  <div className="ng-width-1-1 ng-margin-medium-top">
                                    <FakeJsonUpload
                                      name="geojson"
                                      type=".geojson"
                                      label={`${t('Place shape')}*`}
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
                                        {t('Area ha')}:
                                      </span>{' '}
                                      {km2toHa(areaKm2)}
                                    </p>
                                  )}
                                  {bbox2d && (
                                    <p className="ng-margin-bottom ng-margin-top-remove">
                                      <span className="ng-text-weight-bold ng-color-mdgray">
                                        {t('Area Bbox')}:
                                      </span>{' '}
                                      {formatArrayToParentheses(bbox2d, 'rounded', 2)}
                                    </p>
                                  )}
                                  {centroid && (
                                    <p className="ng-margin-bottom ng-margin-top-remove">
                                      <span className="ng-text-weight-bold ng-color-mdgray">
                                        {t('Centroid')}:
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
                            {panel === 'json' && (
                              <div className="ng-margin-medium-bottom">
                                <JsonEditor
                                  json={geojson}
                                  onChange={(json) => setGeojson(json)}
                                  onError={(e) => setJsonError(e)}
                                />
                              </div>
                            )}
                          </>
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
                    <p className="ng-text-weight-bold ng-margin-small-bottom">
                      {t('Place Metrics')}
                    </p>
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
                    {t('Recalculate all')}
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
                        name={t(intersections[0].type)}
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
              {t('Delete place')}
            </button>
          </div>
        )}
      </ContentLayout>
    )
  );
}
