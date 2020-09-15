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
import { useEffect, useState, useRef } from 'react';
import classnames from 'classnames';
import { JSHINT } from 'jshint';
import renderHTML from 'react-render-html';
import Select from 'react-select';
import Collapse from '@kunukn/react-collapse';
import { Controller, useForm, ErrorMessage } from 'react-hook-form';

import {
  encodeQueryToURL,
  formatDate,
  flattenArrayForSelect,
  flattenObjectForSelect,
  getSelectValues,
  copyToClipboard,
} from 'utils';
import { getAllLayers, getLayer, handleLayerForm } from 'services/layers';
import { useRequest } from 'utils/hooks';

import { noSpecialCharsRule, alphaNumericDashesRule, setupErrors } from 'utils/validations';

import { AsyncSelect } from '@marapp/earth-components';
import { LinkWithOrg } from 'components/link-with-org';
import { DeleteConfirmation } from 'components/modals/delete-confirmation';
import { Input } from 'components/input';
import { InlineEditCard } from 'components/inline-edit-card';
import { Card } from 'components/card';
import { Toggle } from 'components/toggle';
import { JsonEditor } from 'components/json-editor';
import { HtmlEditor } from 'components/html-editor';
import { DetailList } from 'components/detail-list';
import { ErrorMessages } from 'components/error-messages';

import { useAuth0 } from 'auth/auth0';
import { AuthzGuards } from 'auth/permissions';
import { ContentLayout } from 'layouts';


import { LAYER_CATEGORY_OPTIONS, LAYER_PROVIDER_OPTIONS, LAYER_TYPE_OPTIONS } from './model';
import { CUSTOM_STYLES, SELECT_THEME } from '../../theme';

const LAYER_DETAIL_QUERY = {include: 'references', select: 'references.name,references.id'};

export function LayerDetail(path: any) {
  const {getPermissions, selectedGroup} = useAuth0();
  const writePermissions = getPermissions(AuthzGuards.writeLayersGuard);

  const encodedQuery = encodeQueryToURL(`layers/${path.page}`, {
    ...LAYER_DETAIL_QUERY,
    ...{group: selectedGroup},
  });
  const {isLoading, data} = useRequest(() => getLayer(encodedQuery), {
    permissions: AuthzGuards.writeLayersGuard,
    query: encodedQuery,
  });

  const [layer, setLayer] = useState(data);
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
    setLayer(data);
  }, [data]);


  useEffect(() => {
    layer.config && setLayerConfig(layer.config);
    layer.category && setLayerCategory(getSelectValues(LAYER_CATEGORY_OPTIONS, layer.category));
    layer.type && setLayerType(LAYER_TYPE_OPTIONS.find((t) => t.value === layer.type));
    layer.provider && setLayerProvider(LAYER_PROVIDER_OPTIONS.find((p) => p.value === layer.provider));
  }, [layer]);


  const {getValues, register, formState, errors, control} = useForm({
    mode: 'onChange',
  });

  const {touched, dirty, isValid} = formState;
  const renderErrorFor = setupErrors(errors, touched);

  async function onSubmit(e?, setIsEditing?, setIsLoading?, setServerErrors?) {
    e.preventDefault();

    const formData = getValues();

    const {type, category, provider, references} = formData;

    const parsed = {
      ...formData,
      ...(category && {category: flattenArrayForSelect(category, 'value')}),
      ...(type && {type: flattenObjectForSelect(type, 'value')}),
      ...(provider && {provider: flattenObjectForSelect(provider, 'value')}),
      ...(references && {references: flattenArrayForSelect(references, 'id')}),
    };

    try {
      setIsLoading && setIsLoading(true);
      await handleLayerForm(false, parsed, id, selectedGroup);
      const res = await getLayer(encodedQuery);
      setLayer(res.data);
      setIsLoading && setIsLoading(false);
      setIsEditing && setIsEditing(false);
    } catch (error) {
      setIsLoading && setIsLoading(false);
      setServerErrors && setServerErrors(error.data.errors);
    }
  }

  const handleJsonChange = (json) => {
    try {
      JSON.parse(json);
    } catch (err) {
      setJsonError(true);
    }
    if (!JSHINT.errors.length) {
      const parsedJson = JSON.parse(json);
      setLayerConfig(parsedJson);
      setJsonError(false);
      return parsedJson;
    }
    setJsonError(true);
  };

  function handleDeleteToggle() {
    setShowDeleteModal(!showDeleteModal);
  }

  return !!layer && (
    <ContentLayout backTo="/layers" isLoading={isLoading} className="marapp-qa-layerdetail">
      <DeleteConfirmation
        id={id}
        navigateRoute="layers"
        name={name}
        type="layer"
        toggleModal={handleDeleteToggle}
        visibility={showDeleteModal}
      />
      <div className="ng-padding-medium-horizontal">
        <LinkWithOrg className="marapp-qa-actionreturn ng-border-remove ng-margin-bottom ng-display-block" to="/layers">
          <i className="ng-icon ng-icon-directionleft"/>
          return to layers home
        </LinkWithOrg>
        <form className="ng-form ng-form-dark ng-flex-column">
          <div className="ng-grid">
            <div className="ng-width-3-4">
              <InlineEditCard
                onSubmit={onSubmit}
                validForm={isValid}
                render={({setIsEditing, setIsLoading, setServerErrors}) => (
                  <>
                    <Input
                      name="name"
                      placeholder="Layer title"
                      label="Title*"
                      defaultValue={name}
                      className="ng-display-block"
                      error={renderErrorFor('name')}
                      ref={register({
                        required: 'Layer title is required',
                        validate: {
                          noSpecialCharsRule: noSpecialCharsRule(),
                        },
                      })}/>
                  </>
                )}>
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
                  ref={register({})}/>
                <Toggle
                  name="published"
                  label="Published"
                  value={published}
                  className="ng-display-block"
                  onChange={onSubmit}
                  ref={register({})}/>
              </Card>
            </div>
          </div>
          <div className="ng-grid">
            <div className="ng-width-1-2">
              <InlineEditCard
                onSubmit={onSubmit}
                validForm={isValid}
                render={({setIsEditing, setIsLoading, setServerErrors}) => (
                  <>
                    <div className="ng-margin-medium-bottom">
                      <Input
                        name="slug"
                        placeholder="Layer slug"
                        label="Slug*"
                        defaultValue={slug}
                        className="ng-display-block marapp-qa-inputslug"
                        error={renderErrorFor('slug')}
                        ref={register({
                          required: 'Layer slug is required',
                          validate: {
                            alphaNumericDashesRule: alphaNumericDashesRule(),
                          },
                        })}/>
                    </div>
                    <div>
                      <label htmlFor="category">Layer category</label>
                      <Controller as={Select} control={control} className="marapp-qa-category"
                                  name="category"
                                  options={LAYER_CATEGORY_OPTIONS}
                                  defaultValue={layerCategory}
                                  isSearchable
                                  isMulti
                                  placeholder="Select layer category"
                                  styles={CUSTOM_STYLES}
                                  error={renderErrorFor('category')}
                                  theme={theme => ({
                                    ...theme,
                                    ...SELECT_THEME,
                                  })}
                                  rules={{required: true}}/>
                      <div className="ng-form-error-block">
                        <ErrorMessage errors={errors} name="category" message="Layer category cannot be empty" />
                      </div>
                    </div>
                  </>
                )}>
                <div className="ng-margin-medium-bottom">
                  <p className="ng-text-weight-bold ng-margin-remove">Layer slug</p>
                  <p className="ng-margin-remove ng-padding-left">{slug}</p>
                </div>
                <div>
                  <p className="ng-text-weight-bold ng-margin-remove">Layer category</p>
                  {category && <p className="ng-margin-remove ng-padding-left">{category.join(', ')}</p>}
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
            <div className="ng-width-1-1">
              <InlineEditCard
                onSubmit={onSubmit}
                validForm={isValid}
                render={({setIsEditing, setIsLoading, setServerErrors}) => (
                  <>
                    <label className="ng-form-label" htmlFor="description">
                      Layer description
                    </label>

                    <Controller
                      name="description"
                      control={control}
                      defaultValue={description}
                      as={<HtmlEditor html={description}/>}
                    />
                  </>
                )}>
                <div className="ng-margin-medium-bottom">
                  <p className="ng-text-weight-bold ng-margin-remove">Layer description</p>
                  <div
                    className="ng-margin-remove ng-padding-left">{description ? renderHTML(description) : 'No description'}</div>
                </div>
              </InlineEditCard>
            </div>
          </div>
          <div className="ng-grid">
            <div className="ng-width-1-1">
              <InlineEditCard
                onSubmit={onSubmit}
                validForm={isValid}
                render={({setIsEditing, setIsLoading, setServerErrors}) => (
                  <>
                    <div>
                      <label htmlFor="type">Layer provider</label>
                      <Controller as={Select} control={control} className="marapp-qa-provider"
                                  name="provider"
                                  options={LAYER_PROVIDER_OPTIONS}
                                  defaultValue={layerProvider}
                                  isSearchable
                                  placeholder="Select layer provider"
                                  styles={CUSTOM_STYLES}
                                  theme={theme => ({
                                    ...theme,
                                    ...SELECT_THEME,
                                  })}
                                  rules={{required: true}}/>
                    </div>
                    <div>
                      <label htmlFor="type">Layer type</label>
                      <Controller as={Select} control={control} className="marapp-qa-type"
                                  name="type"
                                  options={LAYER_TYPE_OPTIONS}
                                  defaultValue={layerType}
                                  isSearchable
                                  placeholder="Select layer type"
                                  styles={CUSTOM_STYLES}
                                  theme={theme => ({
                                    ...theme,
                                    ...SELECT_THEME,
                                  })}
                                  rules={{required: true}}/>
                    </div>
                  </>
                )}>
                <div className="ng-margin-medium-bottom">
                  <p className="ng-text-weight-bold ng-margin-remove">Layer provider</p>
                  <p className="ng-margin-remove ng-padding-left">{provider}</p>
                </div>
                <div>
                  <p className="ng-text-weight-bold ng-margin-remove">Later type</p>
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
                render={({setIsEditing, setIsLoading, setServerErrors}) => (
                  <>
                    <div className="ng-margin-medium-bottom">
                      <label htmlFor="config">Layer Config</label>
                      <Controller
                        name="config"
                        control={control}
                        defaultValue={layerConfig}
                        onChange={handleJsonChange}
                        as={<JsonEditor json={layerConfig}/>}
                      />
                    </div>
                  </>
                )}>
                <div className="ng-margin-medium-bottom">
                  {config && (
                    <div>
                      <p className="ng-flex">
                        <span className="ng-text-weight-medium">Layer config</span>
                        <span>
                          <i onClick={(e) => copyToClipboard(e, textAreaRef, setCopySuccess)}
                             className='ng-icon ng-icon-layers ng-c-cursor-pointer ng-margin-small-horizontal'/>
                          <span className="ng-text-weight-normal">{copySuccess}</span>
                        </span>
                      </p>

                      <Collapse addState isOpen={collapseJson} collapseHeight="100px">
                        <JsonEditor json={config} readOnly={true}/>
                      </Collapse>
                      <div className="ng-flex ng-flex-center">
                        <i onClick={e => setCollapseJson(!collapseJson)}
                           className={classnames({
                             'ng-icon ng-c-cursor-pointer': true,
                             'ng-icon-directionup': collapseJson,
                             'ng-icon-directiondown': !collapseJson,
                           })}/>
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
                render={({setIsEditing, setIsLoading, setServerErrors}) => (
                  <>
                    <div className="ng-margin-medium-bottom">
                      <label htmlFor="provider">Included layers:</label>
                      <Controller name="references"
                                  type="layers"
                                  className="marapp-qa-references"
                                  control={control}
                                  getOptionLabel={option => option.name}
                                  getOptionValue={option => option.id}
                                  loadFunction={getAllLayers}
                                  defaultValue={references}
                                  selectedGroup={selectedGroup}
                                  as={AsyncSelect}
                                  onChange={([e]) => e}
                                  isClearable
                                  isSearchable
                                  isMulti
                                  styles={CUSTOM_STYLES}
                                  theme={theme => ({
                                    ...theme,
                                    ...SELECT_THEME,
                                  })}
                                  closeMenuOnSelect={false}
                                  placeholder="Select layers"/>
                    </div>
                  </>
                )}>
                <div className="ng-margin-medium-bottom">
                  {!!references ?
                    <DetailList data={references} name='Layer References' type='layers'
                                className="ng-flex-column ng-flex-top"/> :
                    <div>
                      <p className="ng-text-weight-bold ng-margin-small-bottom">Layer references</p>
                      <span className="ng-padding-left">No layer references</span>
                    </div>}
                </div>
              </InlineEditCard>

            </div>
          </div>
          {serverErrors && <ErrorMessages key={id} errors={serverErrors}/>}
        </form>
        {/*hidden input to store config needed for copy to clipboard function*/}
        <input type="text" ref={textAreaRef} value={JSON.stringify(config)} readOnly={true}
               style={{position: 'absolute', left: '-10000px', top: '-10000px'}}/>
        {writePermissions && (
          <div className="ng-text-right ng-margin-medium-top">
            <button className="ng-button ng-button-secondary" onClick={handleDeleteToggle}>
              Delete layer
            </button>
          </div>
        )}
      </div>
    </ContentLayout>
  );
}


