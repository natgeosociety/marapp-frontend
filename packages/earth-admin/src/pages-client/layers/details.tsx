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
import { JSHINT } from 'jshint';
import { LayerContext } from 'utils/contexts';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { encodeQueryToURL, formatDate, setPage } from 'utils';
import { getAllLayers, getLayer, handleLayerForm } from 'services/layers';
import { useRequest } from 'utils/hooks';
import renderHTML from 'react-render-html';
import { intersection } from 'lodash';
import { CUSTOM_STYLES, SELECT_THEME } from '../../theme';
import Select from 'react-select';
import { LinkWithOrg } from 'components/link-with-org';
import { ActionModal } from 'components/action-modal';
import { Input } from 'components/input';
import { InlineEditCard } from 'components/inline-edit-card';
import { Card } from 'components/card';
import { Toggle } from 'components/toggle';
import { useAuth0 } from 'auth/auth0';
import { AuthzGuards } from 'auth/permissions';
import { ContentLayout, SidebarLayout } from 'layouts';
import { Controller, useForm } from 'react-hook-form';
import { noSpecialChars, noSpecialCharsOrSpace, setupErrors } from 'utils/validations';
import { navigate } from 'gatsby';
import { PlaceTypeEnum } from 'pages-client/places/model';
import { getPlace, handlePlaceForm } from 'services';
import { LAYER_CATEGORY_OPTIONS, LAYER_TYPE_OPTIONS } from 'pages-client/layers/model';
import { AsyncSelect } from '@marapp/earth-components';
import { JsonEditor } from 'components/json-editor';

const LAYER_DETAIL_QUERY = {include: 'references', select: 'references.name,references.id'};
const INIT_CURSOR_LOCATION = '-1';

const PAGE_TYPE = setPage('Layers');

export function LayerDetail(path: any) {
  const {getPermissions, selectedGroup} = useAuth0();
  const writePermissions = getPermissions(AuthzGuards.writeLayersGuard);

  const encodedQuery = encodeQueryToURL(`layers/${path.page}`, {
    ...LAYER_DETAIL_QUERY,
    ...{group: selectedGroup},
  });
  const {isLoading, data} = useRequest(() => getLayer(encodedQuery), {
    permissions: AuthzGuards.writeLayersGuard,
    skip: path.newLayer,
  });

  const [layer, setLayer] = useState(data);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formValid, setFormValid] = useState(true);
  const [jsonError, setJsonError] = useState(false);
  const [serverErrors, setServerErrors] = useState();
  const [layerConfig, setLayerConfig] = useState();
  const [aaa, setaaa] = useState();
  const [layerCategory, setLayerCategory] = useState(null);
  const [layerType, setLayerType] = useState(null);


  function copyToClipboard(e) {
    e.preventDefault();
    textAreaRef.current.select();

    document.execCommand('copy');
    // This is just personal preference.
    // I prefer to not show the whole text area selected.
    e.target.focus();
    setCopySuccess('Copied!');

    setTimeout(() => {
      setCopySuccess('');
    }, 4000);
  }


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


  const [copySuccess, setCopySuccess] = useState('');
  const textAreaRef = useRef(null);

  useEffect(() => {
    setLayer(data);

    data.category && setLayerCategory(getSelectValues(LAYER_CATEGORY_OPTIONS, data.category));
    data.type && setLayerType(LAYER_TYPE_OPTIONS.find((t) => t.value === data.type));
  }, [data]);

  const getSelectValues = (options, values) => {

    let coco = [];
    values.map(value => {
      const puff = options.find(val => val.value === value);
      return coco.push(puff);
    });


    return coco;
  };

  const setSelectValues = (e, field) => {
    return !!e ? e.map(val => val[field]) : e;
  };

  const setSelectValues2 = (e) => {
    console.log(e, 'values 2');
    return !!e ? e.value : e;
  };

  const {getValues, register, formState, errors, control} = useForm({
    mode: 'onChange',
  });

  const {touched, dirty, isValid} = formState;
  const renderErrorFor = setupErrors(errors, touched);

  useEffect(() => {
    setFormValid(isValid);
  }, [isValid]);


  async function onSubmit(e?, setIsEditing?, setIsLoading?, setServerErrors?) {
    e.preventDefault();

    const formData = getValues();

    console.log(layerType, 'layer type');
    const parsed = {
      ...formData,
      ...(layerCategory && {category: setSelectValues(layerCategory, 'value')}),
      ...(layerType && {type: setSelectValues2(layerType)}),
      ...(!!formData.references && {references: setSelectValues(formData.references, 'id')}),
    };


    console.log(parsed);

    // try {
    //   setIsLoading && setIsLoading(true);
    //   await handleLayerForm(false, formData, id, selectedGroup);
    //   const res = await getLayer(encodedQuery);
    //   setLayer(res.data);
    //   setIsLoading && setIsLoading(false);
    //   setIsEditing && setIsEditing(false);
    // } catch (error) {
    //   setIsLoading && setIsLoading(false);
    //   setServerErrors && setServerErrors(error.data.errors);
    // }
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


  function handleServerErrors(errors) {
    setServerErrors(errors);
  }

  function handleDeleteToggle() {
    setShowDeleteModal(!showDeleteModal);
  }

  return (
    <ContentLayout backTo="/layers" isLoading={isLoading} className="marapp-qa-layerdetail">
      {showDeleteModal && (
        <ActionModal
          id={id}
          navigateRoute={'layers'}
          name={name}
          type="layer"
          toggleModal={handleDeleteToggle}
          visibility={showDeleteModal}
        />
      )}
      <div className="ng-padding-medium-horizontal">
        <LinkWithOrg className="marapp-qa-actionreturn ng-border-remove ng-margin-bottom ng-display-block" to="/layers">
          <i className="ng-icon ng-icon-directionleft"></i>
          return to layers home
        </LinkWithOrg>
        <form className="ng-form ng-form-dark ng-flex-column">

          <label htmlFor="provider">Included layers:</label>


          {/*{ <Controller name="references"*/}
          {/*            type="layers"*/}
          {/*            className="marapp-qa-references"*/}
          {/*            control={control}*/}
          {/*            loadFunction={getAllLayers}*/}
          {/*            selectedGroup={selectedGroup}*/}
          {/*            as={AsyncSelect}*/}
          {/*            isClearable*/}
          {/*            isSearchable*/}
          {/*            isMulti*/}
          {/*            closeMenuOnSelect={false}*/}
          {/*            placeholder="Select layers"/>}*/}


          <div className="ng-grid">
            <div className="ng-width-3-4">
              <InlineEditCard
                onSubmit={onSubmit}
                validForm={formValid}
                render={({setIsEditing, setIsLoading, setServerErrors}) => (
                  <>
                    <Input
                      name="name"
                      placeholder="Layer title"
                      label="Title*"
                      defaultValue={name}
                      className="ng-display-block"
                      error={renderErrorFor('name', 'noSpecialChars')}
                      ref={register({
                        required: 'Layer title is required',
                        validate: {noSpecialChars},
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
                validForm={true}
                render={({setIsEditing, setIsLoading, setServerErrors}) => (
                  <>
                    <div className="ng-margin-medium-bottom">
                      <Input
                        name="slug"
                        placeholder="Layer slug"
                        label="Slug*"
                        defaultValue={slug}
                        className="ng-display-block"
                        error={renderErrorFor('slug', 'noSpecialCharsOrSpace')}
                        ref={register({
                          required: 'Layer slug is required',
                          validate: {noSpecialCharsOrSpace},
                        })}/>
                    </div>
                    <div>
                      <label htmlFor="category">Layer category</label>
                      <Select
                        className="marapp-qa-category"
                        name="category"
                        options={LAYER_CATEGORY_OPTIONS}
                        isClearable
                        isSearchable
                        isMulti
                        value={layerCategory}
                        placeholder="Select layer category"
                        onChange={(e) => setLayerCategory(e)}
                        styles={CUSTOM_STYLES}
                        theme={theme => ({
                          ...theme,
                          ...SELECT_THEME,
                        })}
                        ref={register({
                          name: 'category',
                          required: 'Layer category is required',
                        })}/>
                    </div>
                  </>
                )}>
                <div className="ng-margin-medium-bottom">
                  <p className="ng-text-weight-bold ng-margin-remove">Layer slug</p>
                  <p className="ng-margin-remove ng-padding-left">{slug}</p>
                </div>
                <div>
                  <p className="ng-text-weight-bold ng-margin-remove">Layer category</p>

                  <p className="ng-margin-remove ng-padding-left">{category}</p>
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
              {/*  <Card>
                {description && <div className="ng-border-add ng-padding">{renderHTML(description)}</div>}
              </Card>*/}
            </div>
          </div>
          <div className="ng-grid">
            <div className="ng-width-1-1">
              <InlineEditCard
                onSubmit={onSubmit}
                validForm={true}
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
                                  closeMenuOnSelect={false}
                                  placeholder="Select layers"/>
                    </div>
                    <div>
                      <label htmlFor="type">Layer type</label>
                      <Select
                        className="marapp-qa-type"
                        name="type"
                        options={LAYER_TYPE_OPTIONS}
                        isClearable
                        isSearchable
                        value={layerType}
                        placeholder="Select layer type"
                        onChange={(e) => setLayerType(e)}
                        styles={CUSTOM_STYLES}
                        theme={theme => ({
                          ...theme,
                          ...SELECT_THEME,
                        })}
                        ref={register({
                          name: 'type',
                          required: 'Layer type is required',
                        })}/>

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

                  {config && <div>
                    <p className="ng-flex ng-flex-space-between">
                      <span className="ng-text-weight-medium">Layer config:</span>
                      <span>
                        <i onClick={(e) => copyToClipboard(e)}
                           className='ng-icon ng-icon-layers ng-c-cursor-pointer ng-margin-small-right'/>
                        <span className="ng-text-weight-normal">{copySuccess}</span>
                      </span>
                    </p>
                    <JsonEditor json={config} readOnly={true}/>

                  </div>}
                </div>
              </InlineEditCard>
            </div>
          </div>
        </form>

        <input type="text" ref={textAreaRef} value={JSON.stringify(config)}
               style={{position: 'absolute', left: '-10000px', top: '-10000px'}}/>
      </div>
    </ContentLayout>
  );
}
