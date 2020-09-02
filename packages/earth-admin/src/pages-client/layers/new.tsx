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
import { useState, useEffect } from 'react';
import { JSHINT } from 'jshint';
import { Controller, useForm } from 'react-hook-form';
import { Spinner, MultiSelect, AsyncSelect } from '@marapp/earth-components';
import { useAuth0 } from 'auth/auth0';
import { getAllLayers, getUniqueSlug } from 'services/layers';
import { setupErrors } from 'utils/validations';

import {
  LinkWithOrg,
  ErrorMessages,
  Card,
  Input,
  HtmlEditor,
  JsonEditor,
} from 'components';
import { ContentLayout } from 'layouts';
import {
  LAYER_CATEGORY_OPTIONS,
  LAYER_TYPE_OPTIONS,
  LAYER_PROVIDER_OPTIONS,
} from 'components/layers/model';
import { AsyncPaginate } from 'react-select-async-paginate';


export function NewLayer(path: any) {
  const {getValues, register, watch, formState, errors, setValue, control} = useForm({
    mode: 'onChange',
  });


  const {touched, dirty, isValid} = formState;

  const watchName = watch('name');
  const watchJson = watch('config');
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);
  const [jsonError, setJsonError] = useState(false);
  const [layerConfig, setLayerConfig] = useState({});
  const {selectedGroup} = useAuth0();
  const renderErrorFor = setupErrors(errors, touched);
  const [references, setReferences] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();

    const formData = getValues();

    console.log(isValid, errors);
    const parsed = {
      ...formData,
      ...(!!layerConfig && {config: layerConfig}),
      ...(!!references && {references: references})
    };

    console.log(parsed, 'form data');

    // try {
    //   setIsLoading(true);
    //   const response: any = await addLayer(parsed, selectedGroup);
    //   await navigate(`/${selectedGroup}/layers/${response.data.id}`);
    // } catch (error) {
    //   setIsLoading(false);
    //   setServerErrors(error.data.errors);
    // }
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

  return (
    <ContentLayout backTo="/layers">
      <div>
        <div className="ng-flex ng-flex-space-between">
          <h2 className="ng-text-display-m ng-c-flex-grow-1">New layer</h2>
        </div>

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
              <label htmlFor="category">Layer category*</label>

              <Controller
                control={control}
                name="category"
                as={<MultiSelect
                  name="category"
                  options={LAYER_CATEGORY_OPTIONS}
                  as={MultiSelect}
                  isMulti
                  isClearable
                  isSearchable
                  ref={() =>
                    register(
                      {name: 'category'},
                      {
                        required: true,
                      },
                    )
                  }
                  placeholder="Select layer categories"/>}
              />

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

              <Controller
                control={control}
                name="provider"
                as={<MultiSelect
                  name="provider"
                  options={LAYER_PROVIDER_OPTIONS}
                  as={MultiSelect}
                  isClearable
                  isSearchable
                  ref={() =>
                    register(
                      {name: 'provider'},
                      {
                        required: true,
                      },
                    )
                  }
                  placeholder="Select layer provider"/>}
              />
            </div>
            <div className="ng-width-1-1">
              <label htmlFor="type">Layer type*</label>
              <Controller
                control={control}
                name="type"
                as={<MultiSelect
                  name="type"
                  options={LAYER_TYPE_OPTIONS}
                  as={MultiSelect}
                  isClearable
                  isSearchable
                  ref={() =>
                    register(
                      {name: 'type'},
                      {
                        required: true,
                      },
                    )
                  }
                  placeholder="Select layer type"/>}
              />
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
              <Controller name="references"
                          type="layers"
                          control={control}
                          loadFunction={getAllLayers}
                          selectedGroup={selectedGroup}
                          onChange={(e) => setReferences(e)}
                          as={AsyncSelect}
                          isClearable
                          isSearchable
                          placeholder="Select layers"/>
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
                  disabled={!isValid || jsonError || !dirty || !watchJson}
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
