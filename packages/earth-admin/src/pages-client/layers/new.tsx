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
import { useTranslation } from 'react-i18next';
import Select from 'react-select';

import {
  alphaNumericDashesRule,
  AsyncSelect,
  Card,
  ErrorMessages,
  Input,
  setupErrors,
  Spinner,
} from '@marapp/earth-shared';

import { useAuth0 } from '@app/auth/auth0';
import { HtmlEditor } from '@app/components/html-editor';
import { JsonEditor } from '@app/components/json-editor';
import { LinkWithOrg } from '@app/components/link-with-org';
import { ContentLayout } from '@app/layouts';
import LayersService from '@app/services/layers';
import { CUSTOM_STYLES, SELECT_THEME } from '@app/theme';
import { flattenArrayForSelect, flattenObjectForSelect } from '@app/utils';

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
  const { t } = useTranslation('admin');
  const { register, watch, formState, errors, setValue, control, handleSubmit } = useForm({
    mode: 'onChange',
  });
  const {
    category: layerCategoryOptions = [],
    type: layerTypeOptions = [],
    provider: layerProviderOptions = [],
  } = dynamicOptions;

  const { touched, dirty, isValid } = formState;
  const renderErrorFor = setupErrors(errors, touched);

  const watchName = watch('name');
  const watchJson = watch('config');

  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);
  const [jsonError, setJsonError] = useState(false);

  const [references, setReferences] = useState();

  const onSubmit = async (values: any) => {
    const { type, category, provider, references } = values;

    const parsed = {
      ...values,
      ...(category && { category: flattenArrayForSelect(category, 'value') }),
      ...(type && { type: flattenObjectForSelect(type) }),
      ...(provider && { provider: flattenObjectForSelect(provider) }),
      ...(!!references && { references: flattenArrayForSelect(references, 'id') }),
    };

    try {
      setIsLoading(true);
      const { data } = await LayersService.addLayer(parsed, { group: selectedGroup });
      onDataChange();
      await navigate(`/${selectedGroup}/layers/${data.id}`);
    } catch (error) {
      setIsLoading(false);
      setServerErrors(error.data.errors);
    }
  };

  const generateSlug = async (e) => {
    e.preventDefault();
    try {
      const { data } = await LayersService.getLayerSlug(watchName, { group: selectedGroup });
      setValue('slug', data.slug, true);
    } catch (error) {
      setServerErrors(error.data.errors);
    }
  };

  return (
    <ContentLayout backTo="/layers" className="marapp-qa-newlayer">
      <div>
        <div className="ng-flex ng-flex-space-between">
          <h2 className="ng-text-display-m ng-c-flex-grow-1">{t('New layer')}</h2>
        </div>

        <form className="ng-form ng-form-dark ng-flex-column" onSubmit={handleSubmit(onSubmit)}>
          <Card className="ng-margin-medium-bottom">
            <Input
              name="name"
              placeholder={t('Layer title')}
              label="Title"
              required={true}
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
                  placeholder={t('Layer slug')}
                  label="Slug"
                  required={true}
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
                  title={t(watchName ? 'Generate slug' : 'Add a title first')}
                  className="ng-button ng-button-secondary ng-button-large ng-pointer marapp-qa-actiongenerateslug"
                  style={{ marginTop: '36px' }}
                >
                  {t('Generate a slug name')}
                </button>
              </div>
            </div>
            <div className="ng-width-1-1">
              <label htmlFor="category">{t('Layer category')}*</label>

              <Controller
                as={Select}
                control={control}
                className="marapp-qa-category"
                classNamePrefix="marapp-qa-asyncselect"
                name="category"
                options={layerCategoryOptions}
                isSearchable={true}
                isMulti={true}
                placeholder={t('Select layer category')}
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
                {t('Layer description')}
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
              <label htmlFor="provider">{t('Layer provider')}*</label>
              <Controller
                as={Select}
                control={control}
                className="marapp-qa-provider"
                classNamePrefix="marapp-qa-asyncselect"
                name="provider"
                options={layerProviderOptions}
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
            <div className="ng-width-1-1">
              <label htmlFor="type">{t('Layer type')}*</label>
              <Controller
                as={Select}
                control={control}
                className="marapp-qa-type"
                classNamePrefix="marapp-qa-asyncselect"
                name="type"
                options={layerTypeOptions}
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
          </Card>

          <Card className="ng-margin-medium-bottom">
            <div className="ng-margin-medium-bottom">
              <label htmlFor="config">{t('Layer Config')}*</label>
              <Controller
                className="marapp-qa-config"
                name="config"
                control={control}
                onError={(e) => setJsonError(e)}
                as={<JsonEditor json="" />}
              />
            </div>

            <div className="ng-width-1-1">
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
                isClearable={true}
                isSearchable={true}
                isMulti={true}
                closeMenuOnSelect={false}
                placeholder={t('Select layers')}
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
                {t('Save and view details')}
              </button>

              <LinkWithOrg
                className="ng-button ng-button-secondary ng-button-large marapp-qa-back"
                to="/layers"
              >
                {t('return to home', { value: t('layers') })}
              </LinkWithOrg>
            </div>
          )}
        </form>
      </div>
    </ContentLayout>
  );
}
