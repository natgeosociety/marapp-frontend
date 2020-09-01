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
import { useState } from 'react';
import { navigate } from 'gatsby';
import { JSHINT } from 'jshint';
import { Controller, useForm } from 'react-hook-form';
import { Spinner, MultiSelect, AsyncSelect } from '@marapp/earth-components';

import { useAuth0 } from 'auth/auth0';
import { addLayer, getAllLayers, getLayer, getUniqueSlug } from 'services/layers';
import { noSpecialChars, setupErrors } from 'utils/validations';

import {
  LinkWithOrg,
  ErrorMessages,
  Card,
  FakeJsonUpload,
  Input,
  HtmlEditor,
  JsonEditor,
  SearchInput,
} from 'components';
import { ContentLayout } from 'layouts';
import {
  LayerCategory,
  LayerProvider,
  LayerType,
  LayerCategoriesOptions,
  LayerTypeOptions,
  LayerProviderOptions,
} from 'components/layers/model';
import { encodeQueryToURL } from 'utils';


export function NewLayer(path: any) {
  const {getValues, register, watch, formState, errors, setValue, control} = useForm({
    mode: 'onChange',
  });
  const {touched, dirty, isValid} = formState;
  const watchName = watch('name');
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);
  const [jsonError, setJsonError] = useState(false);
  const [layerConfig, setLayerConfig] = useState();
  const {selectedGroup} = useAuth0();
  const [cursor, setCursor] = useState(-1);
  const renderErrorFor = setupErrors(errors, touched);

  const formatForSelect = (data) => {
    return data.map(d => {
      return {value: d.id, label: d.name};
    });
  };

  const loadOptions = async (search, prevOptions) => {

    const query = {
      search: search,
      sort: 'name',
      page: {size: 10, cursor: cursor},
      group: selectedGroup,
    };
    const encodedQuery = encodeQueryToURL('layers', query);
    const res: any = await getAllLayers(encodedQuery);
    const c = formatForSelect(res.data);
    setCursor(res.pagination.nextCursor);


    let filteredOptions = [];
    if (!search) {
      filteredOptions = [...filteredOptions, ...c];
    } else {
      filteredOptions = c;
    }

    const hasMore = !!res.pagination.nextCursor;

    return {
      options: filteredOptions,
      hasMore,
    };
  };

  const shouldLoadMore = (scrollHeight, clientHeight, scrollTop) => {
    const bottomBorder = (scrollHeight - clientHeight) / 2;

    return bottomBorder < scrollTop;
  };

  async function onSubmit(e) {
    e.preventDefault();

    const formData = getValues();
    const parsed = {
      ...formData,
    };

    try {
      setIsLoading(true);
      const response: any = await addLayer(parsed, selectedGroup);
      await navigate(`/${selectedGroup}/layers/${response.data.id}`);
    } catch (error) {
      setIsLoading(false);
      setServerErrors(error.data.errors);
    }
  }

  const generateSlug = async (e) => {
    e.preventDefault();
    try {
      const {data}: any = await getUniqueSlug(watchName, selectedGroup);
      setValue('slug', data.slug, true);
    } catch (error) {
      setServerErrors(error.data.errors);
    }
  };

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


  const [value, onChange] = useState(null);


  return (
    <ContentLayout backTo="/layers">
      <div>
        <div className="ng-flex ng-flex-space-between">
          <h2 className="ng-text-display-m ng-c-flex-grow-1">New layer</h2>
        </div>

        <AsyncSelect type="layers" loadFunction={getAllLayers} selectedGroup={selectedGroup}/>

        <form className="ng-form ng-form-dark ng-flex-column">
          <Card className="ng-margin-medium-bottom">
            <Input
              name="name"
              placeholder="Layer title"
              label="Title*"
              className="ng-display-block"
              ref={register({
                required: 'Layer title is required',
              })}/>
          </Card>

          <Card className="ng-margin-medium-bottom">
            <div className="ng-grid ng-flex-top ng-margin-medium-bottom">
              <div className="ng-flex-item-1">
                <Input
                  name="slug"
                  placeholder="Layer slug"
                  label="Slug*"
                  className="ng-display-block"
                  error={renderErrorFor('slug')}
                  ref={register({
                    required: 'Layer slug is required',
                  })}/>
              </div>
              <div>
                <button
                  onClick={generateSlug}
                  disabled={!watchName || !!errors.name}
                  title={watchName ? 'Generate slug' : 'Add a title first'}
                  className="ng-button ng-button-secondary ng-button-large ng-pointer"
                  style={{marginTop: '36px'}}>
                  Generate a slug name
                </button>
              </div>
            </div>
            <div className="ng-width-1-1">
              <MultiSelect options={LayerCategoriesOptions} isMulti isSearchable/>
              {/*<label htmlFor="category">Layer category*</label>*/}
              {/*<select*/}
              {/*  className="ng-width-1-1 ng-form-large"*/}
              {/*  multiple*/}
              {/*  id="category"*/}
              {/*  ref={register({*/}
              {/*    required: 'Layer category is required',*/}
              {/*  })}*/}
              {/*  name="category"*/}
              {/*>*/}
              {/*  {Object.keys(LayerCategory).map((c, idx) => (*/}
              {/*    <option*/}
              {/*      key={idx}*/}
              {/*      value={LayerCategory[c]}*/}
              {/*    >*/}
              {/*      {LayerCategory[c]}*/}
              {/*    </option>*/}
              {/*  ))}*/}
              {/*</select>*/}
            </div>
          </Card>

          <Card className="ng-margin-medium-bottom">
            <div className="ng-width-1-1">
              <label className="ng-form-label" htmlFor="description">
                Layer description
              </label>

              <Controller
                name="description"
                control={control}
                as={<HtmlEditor html=""/>}
              />
            </div>
          </Card>

          <Card className="ng-margin-medium-bottom">
            <div className="ng-width-1-1 ng-margin-medium-bottom">


              <label htmlFor="provider">Layer provider*</label>
              <MultiSelect options={LayerProviderOptions} isSearchable/>
              {/*<select*/}
              {/*  className="ng-width-1-1 ng-form-large"*/}
              {/*  id="provider"*/}
              {/*  ref={register({*/}
              {/*    required: 'Layer provider is required',*/}
              {/*  })}*/}
              {/*  name="provider"*/}
              {/*>*/}
              {/*  {Object.keys(LayerProvider).map((p, idx) => (*/}
              {/*    <option key={idx} value={p}>*/}
              {/*      {p}*/}
              {/*    </option>*/}
              {/*  ))}*/}
              {/*</select>*/}
            </div>
            <div className="ng-width-1-1">
              <label htmlFor="type">Layer type*</label>

              <MultiSelect options={LayerTypeOptions} isSearchable/>
              {/*<select*/}
              {/*  className="ng-width-1-1 ng-form-large"*/}
              {/*  id="type"*/}
              {/*  ref={register({*/}
              {/*    required: 'Layer type is required',*/}
              {/*  })}*/}
              {/*  name="type"*/}
              {/*>*/}
              {/*  {Object.keys(LayerType).map((t, idx) => (*/}
              {/*    <option key={idx} value={t}>*/}
              {/*      {t}*/}
              {/*    </option>*/}
              {/*  ))}*/}
              {/*</select>*/}
            </div>
          </Card>

          <Card className="ng-margin-medium-bottom">
            <div className="ng-margin-medium-bottom">
              <label htmlFor="config">Layer Config*</label>
              <Controller
                name="config"
                control={control}
                onChange={(layerConfig) => handleJsonChange(layerConfig)}
                as={<JsonEditor json=""/>}
              />
            </div>

            <div className="ng-width-1-1">
              <label htmlFor="provider">Included layers:</label>


              {/*<Controller*/}
              {/*  name="references"*/}
              {/*  control={control}*/}
              {/*  valueName={id}*/}
              {/*  as={<SearchInput options={references} optionType="layers" />}*/}
              {/*/>*/}
            </div>
          </Card>

          {!!serverErrors.length && <ErrorMessages errors={serverErrors}/>}

          {isLoading
            ? <div className="ng-padding-large ng-position-relative"><Spinner/></div>
            : (
              <div className="ng-flex">
                <button
                  className="ng-button ng-button-primary ng-button-large ng-margin-medium-right"
                  onClick={onSubmit}
                  disabled={!isValid || jsonError || !dirty}
                >
                  Save and view details
                </button>

                <LinkWithOrg className="ng-button ng-button-secondary ng-button-large" to="/layers">
                  Return to layers home
                </LinkWithOrg>
              </div>
            )}
        </form>
      </div>
    </ContentLayout>
  );
}
