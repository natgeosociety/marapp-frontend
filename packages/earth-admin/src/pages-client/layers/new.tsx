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

import { navigate } from 'gatsby';
import { JSHINT } from 'jshint';
import { noop } from 'lodash';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';

import { AsyncSelect, ErrorMessages, Spinner } from '@marapp/earth-shared';

import { useAuth0 } from '@app/auth/auth0';
import { Card } from '@app/components/card';
import { HtmlEditor } from '@app/components/html-editor';
import { Input } from '@app/components/input';
import { JsonEditor } from '@app/components/json-editor';
import { LinkWithOrg } from '@app/components/link-with-org';
import { ContentLayout } from '@app/layouts';
import { addLayer, getAllLayers, getLayerSlug } from '@app/services/layers';
import { CUSTOM_STYLES, SELECT_THEME } from '@app/theme';
import { flattenArrayForSelect, flattenObjectForSelect } from '@app/utils';
import { alphaNumericDashesRule, setupErrors } from '@app/utils/validations';

interface IProps {
  path?: string;
  onDataChange?: () => {};
  dynamicOptions?: {
    category?: any[];
    type?: any[];
    provider?: any[];
  };
}

export function NewLayer(props: IProps) {
  const { onDataChange = noop, dynamicOptions } = props;
  const { selectedGroup } = useAuth0();
  const { register, watch, formState, errors, setValue, control, handleSubmit } = useForm({
    mode: 'onChange',
  });
  const {
    category: categoryOptions = [],
    type: typeOptions = [],
    provider: providerOptions = [],
  } = dynamicOptions;

  const { touched, dirty, isValid } = formState;
  const renderErrorFor = setupErrors(errors, touched);

  const watchName = watch('name');
  const watchJson = watch('config');

  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);
  const [jsonError, setJsonError] = useState(false);
  const [layerConfig, setLayerConfig] = useState({});

  const [references, setReferences] = useState();

  const onSubmit = async (values: any) => {
    const { type, category, provider, references } = values;

    const parsed = {
      ...values,
      ...(category && { category: flattenArrayForSelect(category, 'value') }),
      ...(type && { type: flattenObjectForSelect(type) }),
      ...(provider && { provider: flattenObjectForSelect(provider) }),
      ...(!!layerConfig && { config: layerConfig }),
      ...(!!references && { references: flattenArrayForSelect(references, 'id') }),
    };

    try {
      setIsLoading(true);
      const response: any = await addLayer(parsed, selectedGroup);
      onDataChange();
      await navigate(`/${selectedGroup}/layers/${response.data.id}`);
    } catch (error) {
      setIsLoading(false);
      setServerErrors(error.data.errors);
    }
  };

  const generateSlug = async (e) => {
    e.preventDefault();
    try {
      const { data }: any = await getLayerSlug(watchName, selectedGroup);
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
    <ContentLayout backTo="/layers" className="marapp-qa-newlayer">
      <div>
        <div className="ng-flex ng-flex-space-between">
          <h2 className="ng-text-display-m ng-c-flex-grow-1">New layer</h2>
        </div>

        <form className="ng-form ng-form-dark ng-flex-column" onSubmit={handleSubmit(onSubmit)}>
          <Card className="ng-margin-medium-bottom">
            <Input
              name="name"
              placeholder="Layer title"
              label="Title*"
              className="ng-display-block"
              error={renderErrorFor('name')}
              ref={register({
                required: 'Layer title is required',
              })}
            />
          </Card>

          <Card className="ng-margin-medium-bottom">
            <div className="ng-grid ng-flex-top ng-margin-medium-bottom">
              <div className="ng-flex-item-1">
                <Input
                  name="slug"
                  placeholder="Layer slug"
                  label="Slug*"
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
                <button
                  onClick={generateSlug}
                  disabled={!watchName || !!errors.name}
                  title={watchName ? 'Generate slug' : 'Add a title first'}
                  className="ng-button ng-button-secondary ng-button-large ng-pointer marapp-qa-actiongenerateslug"
                  style={{ marginTop: '36px' }}
                >
                  Generate a slug name
                </button>
              </div>
            </div>
            <div className="ng-width-1-1">
              <label htmlFor="category">Layer category*</label>

              <Controller
                as={Select}
                control={control}
                className="marapp-qa-category"
                name="category"
                options={categoryOptions}
                isSearchable={true}
                isMulti={true}
                placeholder="Select layer category"
                styles={CUSTOM_STYLES}
                theme={(theme) => ({
                  ...theme,
                  ...SELECT_THEME,
                })}
                rules={{ required: true }}
              />
            </div>
          </Card>

          <Card className="ng-margin-medium-bottom">
            <div className="ng-width-1-1">
              <label className="ng-form-label" htmlFor="description">
                Layer description
              </label>

              <Controller
                className="marapp-qa-description"
                name="description"
                control={control}
                as={<HtmlEditor html="" />}
              />
            </div>
          </Card>

          <Card className="ng-margin-medium-bottom">
            <div className="ng-width-1-1 ng-margin-medium-bottom">
              <label htmlFor="provider">Layer provider*</label>
              <Controller
                as={Select}
                control={control}
                className="marapp-qa-provider"
                name="provider"
                options={providerOptions}
                isSearchable={true}
                placeholder="Select layer provider"
                styles={CUSTOM_STYLES}
                theme={(theme) => ({
                  ...theme,
                  ...SELECT_THEME,
                })}
                rules={{ required: true }}
              />
            </div>
            <div className="ng-width-1-1">
              <label htmlFor="type">Layer type*</label>
              <Controller
                as={Select}
                control={control}
                className="marapp-qa-type"
                name="type"
                options={typeOptions}
                isSearchable={true}
                placeholder="Select layer type"
                styles={CUSTOM_STYLES}
                theme={(theme) => ({
                  ...theme,
                  ...SELECT_THEME,
                })}
                rules={{ required: true }}
              />
            </div>
          </Card>

          <Card className="ng-margin-medium-bottom">
            <div className="ng-margin-medium-bottom">
              <label htmlFor="config">Layer Config*</label>
              <Controller
                className="marapp-qa-config"
                name="config"
                control={control}
                onChange={(layerConfig) => handleJsonChange(layerConfig)}
                as={<JsonEditor json="" />}
              />
            </div>

            <div className="ng-width-1-1">
              <label htmlFor="provider">Included layers:</label>
              <Controller
                name="references"
                type="layers"
                className="marapp-qa-references"
                control={control}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
                loadFunction={getAllLayers}
                defaultValue={references}
                selectedGroup={selectedGroup}
                as={AsyncSelect}
                isClearable={true}
                isSearchable={true}
                isMulti={true}
                closeMenuOnSelect={false}
                placeholder="Select layers"
                styles={CUSTOM_STYLES}
                theme={(theme) => ({
                  ...theme,
                  ...SELECT_THEME,
                })}
              />
            </div>
          </Card>

          {!!serverErrors.length && <ErrorMessages errors={serverErrors} />}
          {isLoading ? (
            <div className="ng-padding-large ng-position-relative">
              <Spinner />
            </div>
          ) : (
            <div className="ng-flex">
              <button
                className="ng-button ng-button-primary ng-button-large ng-margin-medium-right marapp-qa-actionsubmit"
                disabled={!isValid || jsonError || !dirty || !watchJson}
              >
                Save and view details
              </button>

              <LinkWithOrg
                className="ng-button ng-button-secondary ng-button-large marapp-qa-back"
                to="/layers"
              >
                Return to layers home
              </LinkWithOrg>
            </div>
          )}
        </form>
      </div>
    </ContentLayout>
  );
}
