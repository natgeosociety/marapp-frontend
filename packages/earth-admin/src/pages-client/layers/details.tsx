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

import Collapse from '@kunukn/react-collapse';
import classnames from 'classnames';
import { JSHINT } from 'jshint';
import { noop } from 'lodash';
import { merge } from 'lodash/fp';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, ErrorMessage, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import renderHTML from 'react-render-html';
import Select from 'react-select';
import useSWR from 'swr';

import {
  alphaNumericDashesRule,
  AsyncSelect,
  AuthzGuards,
  Card,
  ErrorMessages,
  InlineEditCard,
  Input,
  notEmptyRule,
  setupErrors,
} from '@marapp/earth-shared';

import { useAuth0 } from '@app/auth/auth0';
import { DetailList } from '@app/components/detail-list';
import { HtmlEditor } from '@app/components/html-editor';
import { JsonEditor } from '@app/components/json-editor';
import { LinkWithOrg } from '@app/components/link-with-org';
import { DeleteConfirmation } from '@app/components/modals/delete-confirmation';
import { Toggle } from '@app/components/toggle';
import { ContentLayout } from '@app/layouts';
import { generateCacheKey } from '@app/services';
import LayersService from '@app/services/layers';
import { CUSTOM_STYLES, SELECT_THEME } from '@app/theme';
import {
  copyToClipboard,
  flattenArrayForSelect,
  flattenObjectForSelect,
  formatDate,
  getSelectValues,
} from '@app/utils';

import { ILayer } from './model';

const LAYER_DETAIL_QUERY = { include: 'references', select: 'references.name,references.id' };

export function LayerDetail(props: any) {
  const { page, onDataChange = noop, dynamicOptions } = props;
  const { getPermissions, selectedGroup } = useAuth0();
  const { t } = useTranslation('admin');
  const writePermissions = getPermissions(AuthzGuards.writeLayersGuard);
  const {
    category: layerCategoryOptions = [],
    type: layerTypeOptions = [],
    provider: layerProviderOptions = [],
  } = dynamicOptions;

  const query = merge(LAYER_DETAIL_QUERY, { group: selectedGroup });
  const cacheKey = generateCacheKey(`layers/${page}`, query);

  const fetcher = () => LayersService.getLayer(page, query).then((response: any) => response.data);

  const setter = (data) =>
    LayersService.handleLayerForm(false, data, id, query).then((response: any) => response.data);

  const { data, error, revalidate, mutate } = useSWR(cacheKey, fetcher);

  const [layer, setLayer] = useState<ILayer>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jsonError, setJsonError] = useState(false);
  const [serverErrors, setServerErrors] = useState();
  const [layerConfig, setLayerConfig] = useState();
  const [layerCategory, setLayerCategory] = useState(null);
  const [layerType, setLayerType] = useState(null);
  const [layerProvider, setLayerProvider] = useState(null);
  const [collapseJson, setCollapseJson] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const textAreaRef = useRef(null);

  const {
    id,
    name,
    description,
    primary,
    published,
    version,
    createdAt,
    updatedAt,
    slug,
    type,
    provider,
    category,
    config,
    references,
  } = layer;

  useEffect(() => {
    data && setLayer(data);
  }, [data]);

  useEffect(() => {
    layer.config && setLayerConfig(layer.config);
    layer.category && setLayerCategory(getSelectValues(layerCategoryOptions, layer.category));
    layer.type && setLayerType(layerTypeOptions.find((t) => t.value === layer.type));
    layer.provider &&
      setLayerProvider(layerProviderOptions.find((p) => p.value === layer.provider));
  }, [layer]);

  const { getValues, register, formState, errors, control } = useForm({
    mode: 'onChange',
  });

  const { touched, dirty, isValid } = formState;
  const renderErrorFor = setupErrors(errors, touched);

  async function onSubmit(e?, setIsEditing?, setIsLoading?, setServerErrors?) {
    e.preventDefault();

    const formData = getValues();

    const { type, category, provider, references } = formData;

    const parsed = {
      ...formData,
      ...(category && { category: flattenArrayForSelect(category, 'value') }),
      ...(type && { type: flattenObjectForSelect(type, 'value') }),
      ...(provider && { provider: flattenObjectForSelect(provider, 'value') }),
      ...(references && { references: flattenArrayForSelect(references, 'id') }),
    };

    try {
      setIsLoading && setIsLoading(true);

      await mutate(await setter(parsed), false);

      setIsEditing && setIsEditing(false);
      setIsLoading && setIsLoading(false);

      await onDataChange();
    } catch (error) {
      setIsLoading && setIsLoading(false);
      setServerErrors && setServerErrors(error.data.errors);
    }
  }

  function handleDeleteToggle() {
    setShowDeleteModal(!showDeleteModal);
  }

  return (
    !!layer && (
      <ContentLayout
        backTo="/layers"
        isLoading={!data && !error}
        errorPage="layer"
        errors={error?.data?.errors}
        className="marapp-qa-layerdetail"
      >
        <DeleteConfirmation
          id={id}
          navigateRoute="layers"
          name={name}
          type="layer"
          toggleModal={handleDeleteToggle}
          onDelete={onDataChange}
          visibility={showDeleteModal}
        />
        <div className="ng-padding-medium-horizontal">
          <LinkWithOrg
            className="marapp-qa-actionreturn ng-border-remove ng-margin-bottom ng-display-inline-block"
            to="/layers"
          >
            <i className="ng-icon ng-icon-directionleft" />
            {t('return to home', { value: 'layers' })}
          </LinkWithOrg>
          <form className="ng-form ng-form-dark ng-flex-column">
            <div className="ng-grid">
              <div className="ng-width-3-4">
                <InlineEditCard
                  onSubmit={onSubmit}
                  validForm={isValid}
                  render={({ setIsEditing, setIsLoading, setServerErrors }) => (
                    <>
                      <Input
                        name="name"
                        placeholder={t('Layer title')}
                        label="Title"
                        required={true}
                        defaultValue={name}
                        className="ng-display-block"
                        error={renderErrorFor('name')}
                        ref={register({
                          required: 'Layer title is required',
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
                    name="primary"
                    label="Primary"
                    value={primary}
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
                  validForm={isValid}
                  render={({ setIsEditing, setIsLoading, setServerErrors }) => (
                    <>
                      <div className="ng-margin-medium-bottom">
                        <Input
                          name="slug"
                          placeholder={t('Layer slug')}
                          label="Slug"
                          required={true}
                          defaultValue={slug}
                          className="ng-display-block marapp-qa-inputslug"
                          error={renderErrorFor('slug')}
                          ref={register({
                            required: 'Layer slug is required',
                            validate: {
                              alphaNumericDashesRule: alphaNumericDashesRule(),
                            },
                          })}
                        />
                      </div>
                      <div>
                        <label htmlFor="category">{t('Layer category')}</label>
                        <Controller
                          as={Select}
                          control={control}
                          className="marapp-qa-category"
                          classNamePrefix="marapp-qa-asyncselect"
                          name="category"
                          options={layerCategoryOptions}
                          defaultValue={layerCategory}
                          isSearchable={true}
                          isMulti={true}
                          closeMenuOnSelect={false}
                          placeholder={t('Select layer category')}
                          styles={CUSTOM_STYLES}
                          error={renderErrorFor('category')}
                          theme={(theme) => ({
                            ...theme,
                            ...SELECT_THEME,
                          })}
                          rules={{
                            required: true,
                            validate: {
                              notEmptyRule: notEmptyRule(t('Layer category cannot be empty')),
                            },
                          }}
                        />
                        <div className="ng-form-error-block">
                          <ErrorMessage
                            errors={errors}
                            name="category"
                            message={t('Layer category cannot be empty')}
                          />
                        </div>
                      </div>
                    </>
                  )}
                >
                  <div className="ng-margin-medium-bottom">
                    <p className="ng-text-weight-bold ng-margin-remove">{t('Layer slug')}</p>
                    <p className="ng-margin-remove ng-padding-left">{slug}</p>
                  </div>
                  <div>
                    <p className="ng-text-weight-bold ng-margin-remove">{t('Layer category')}</p>
                    {category && (
                      <p className="ng-margin-remove ng-padding-left">{category.join(', ')}</p>
                    )}
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
              <div className="ng-width-1-1">
                <InlineEditCard
                  onSubmit={onSubmit}
                  validForm={isValid}
                  render={({ setIsEditing, setIsLoading, setServerErrors }) => (
                    <>
                      <label className="ng-form-label" htmlFor="description">
                        {t('Layer description')}
                      </label>

                      <Controller
                        name="description"
                        control={control}
                        defaultValue={description}
                        as={<HtmlEditor html={description} />}
                      />
                    </>
                  )}
                >
                  <div className="ng-margin-medium-bottom">
                    <p className="ng-text-weight-bold ng-margin-remove">{t('Layer description')}</p>
                    <div className="ng-margin-remove ng-padding-left">
                      {description ? renderHTML(description) : t('No description')}
                    </div>
                  </div>
                </InlineEditCard>
              </div>
            </div>
            <div className="ng-grid">
              <div className="ng-width-1-1">
                <InlineEditCard
                  onSubmit={onSubmit}
                  validForm={isValid}
                  render={({ setIsEditing, setIsLoading, setServerErrors }) => (
                    <>
                      <div>
                        <label htmlFor="type">{t('Layer provider')}</label>
                        <Controller
                          as={Select}
                          control={control}
                          className="marapp-qa-provider"
                          classNamePrefix="marapp-qa-asyncselect"
                          name="provider"
                          options={layerProviderOptions}
                          defaultValue={layerProvider}
                          isSearchable={true}
                          placeholder={t('Select layer provider')}
                          styles={CUSTOM_STYLES}
                          theme={(theme) => ({
                            ...theme,
                            ...SELECT_THEME,
                          })}
                          rules={{ required: true }}
                        />
                      </div>
                      <div>
                        <label htmlFor="type">{t('Layer type')}</label>
                        <Controller
                          as={Select}
                          control={control}
                          className="marapp-qa-type"
                          classNamePrefix="marapp-qa-asyncselect"
                          name="type"
                          options={layerTypeOptions}
                          defaultValue={layerType}
                          isSearchable={true}
                          placeholder={t('Select layer type')}
                          styles={CUSTOM_STYLES}
                          theme={(theme) => ({
                            ...theme,
                            ...SELECT_THEME,
                          })}
                          rules={{ required: true }}
                        />
                      </div>
                    </>
                  )}
                >
                  <div className="ng-margin-medium-bottom">
                    <p className="ng-text-weight-bold ng-margin-remove">{t('Layer provider')}</p>
                    <p className="ng-margin-remove ng-padding-left">{provider}</p>
                  </div>
                  <div>
                    <p className="ng-text-weight-bold ng-margin-remove">{t('Layer type')}</p>
                    <p className="ng-margin-remove ng-padding-left">{type}</p>
                  </div>
                </InlineEditCard>
              </div>
            </div>
            <div className="ng-grid">
              <div className="ng-width-1-1">
                <InlineEditCard
                  onSubmit={onSubmit}
                  validForm={!jsonError}
                  render={({ setIsEditing, setIsLoading, setServerErrors }) => (
                    <>
                      <div className="ng-margin-medium-bottom">
                        <label htmlFor="config">{t('Layer Config')}</label>
                        <Controller
                          name="config"
                          control={control}
                          defaultValue={layerConfig}
                          onError={(e) => setJsonError(e)}
                          as={<JsonEditor json={layerConfig} />}
                        />
                      </div>
                    </>
                  )}
                >
                  <div className="ng-margin-medium-bottom">
                    {config && (
                      <div>
                        <p className="ng-flex">
                          <span className="ng-text-weight-medium">{t('Layer config')}</span>
                          <span>
                            <i
                              onClick={(e) => copyToClipboard(e, textAreaRef, setCopySuccess)}
                              className="ng-icon ng-icon-layers ng-c-cursor-pointer ng-margin-small-horizontal"
                            />
                            <span className="ng-text-weight-normal">{copySuccess}</span>
                          </span>
                        </p>

                        <Collapse addState={true} isOpen={collapseJson} collapseHeight="100px">
                          <JsonEditor json={config} readOnly={true} />
                        </Collapse>
                        <div className="ng-flex ng-flex-center">
                          <i
                            onClick={(e) => setCollapseJson(!collapseJson)}
                            className={classnames({
                              'ng-icon ng-c-cursor-pointer': true,
                              'ng-icon-directionup': collapseJson,
                              'ng-icon-directiondown': !collapseJson,
                            })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </InlineEditCard>
              </div>
            </div>
            <div className="ng-grid">
              <div className="ng-width-1-1">
                <InlineEditCard
                  onSubmit={onSubmit}
                  validForm={isValid}
                  render={({ setIsEditing, setIsLoading, setServerErrors }) => (
                    <>
                      <div className="ng-margin-medium-bottom">
                        <label htmlFor="provider">{t('Included layers')}:</label>
                        <Controller
                          as={AsyncSelect}
                          name="references"
                          type="layers"
                          className="marapp-qa-references"
                          control={control}
                          getOptionLabel={(option) => option.name}
                          getOptionValue={(option) => option.id}
                          loadFunction={LayersService.getAllLayers}
                          defaultValue={references}
                          selectedGroup={selectedGroup}
                          onChange={([e]) => e}
                          isClearable={true}
                          isSearchable={true}
                          isMulti={true}
                          closeMenuOnSelect={false}
                          placeholder={t('Select layers')}
                        />
                      </div>
                    </>
                  )}
                >
                  <div className="ng-margin-medium-bottom">
                    {!!references ? (
                      <DetailList
                        data={references}
                        name={t('Layer References')}
                        type="layers"
                        className="ng-flex-column ng-flex-top"
                      />
                    ) : (
                      <div>
                        <p className="ng-text-weight-bold ng-margin-small-bottom">
                          {t('Layer references')}
                        </p>
                        <span className="ng-padding-left">{t('No layer references')}</span>
                      </div>
                    )}
                  </div>
                </InlineEditCard>
              </div>
            </div>
            {serverErrors && <ErrorMessages key={id} errors={serverErrors} />}
          </form>
          {/*hidden input to store config needed for copy to clipboard function*/}
          <input
            type="text"
            ref={textAreaRef}
            value={JSON.stringify(config)}
            readOnly={true}
            style={{ position: 'absolute', left: '-10000px', top: '-10000px' }}
          />
          {writePermissions && (
            <div className="ng-text-right ng-margin-medium-top">
              <button className="ng-button ng-button-secondary" onClick={handleDeleteToggle}>
                {t('Delete layer')}
              </button>
            </div>
          )}
        </div>
      </ContentLayout>
    )
  );
}
