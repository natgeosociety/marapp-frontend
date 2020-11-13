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
import WidgetsService from '@app/services/widgets';
import { CUSTOM_STYLES, SELECT_THEME } from '@app/theme';
import { flattenObjectForSelect } from '@app/utils';

interface IProps {
  path?: string;
  onDataChange?: () => {};
  dynamicOptions?: {
    metrics?: any[];
  };
}

export function NewWidget(props: IProps) {
  const { onDataChange = noop, dynamicOptions = {} } = props;
  const { metrics: metricsOptions = [] } = dynamicOptions;
  const { selectedGroup } = useAuth0();
  const { register, watch, formState, errors, setValue, control, handleSubmit } = useForm({
    mode: 'onChange',
  });

  const { touched, dirty, isValid } = formState;
  const renderErrorFor = setupErrors(errors, touched);

  const watchName = watch('name');
  const watchJson = watch('config');

  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);
  const [jsonError, setJsonError] = useState(false);
  const [layerConfig, setLayerConfig] = useState({});

  const onSubmit = async (values: any) => {
    const { layers, metrics } = values;

    const parsed = {
      ...values,
      ...(!!layers && { layers: [flattenObjectForSelect(layers, 'id')] }),
      ...(!!metrics && { metrics: [metrics.value] }),
      ...(!!layerConfig && { config: layerConfig }),
    };

    try {
      setIsLoading(true);
      const { data } = await WidgetsService.addWidget(parsed, { group: selectedGroup });
      onDataChange();
      await navigate(`/${selectedGroup}/widgets/${data.id}`);
    } catch (error) {
      setIsLoading(false);
      setServerErrors(error.data.errors);
    }
  };

  const generateSlug = async (e) => {
    e.preventDefault();
    try {
      const { data } = await WidgetsService.getWidgetSlug(watchName, { group: selectedGroup });
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
    <ContentLayout backTo="/dashboards" className="marapp-qa-newwidget">
      <div>
        <div className="ng-flex ng-flex-space-between">
          <h2 className="ng-text-display-m ng-c-flex-grow-1">New Widget</h2>
        </div>

        <form className="ng-form ng-form-dark ng-flex-column" onSubmit={handleSubmit(onSubmit)}>
          <Card className="ng-margin-medium-bottom">
            <Input
              name="name"
              placeholder="Widget title"
              label="Title*"
              className="ng-display-block"
              error={renderErrorFor('name')}
              ref={register({
                required: 'Widget title is required',
              })}
            />
          </Card>

          <Card className="ng-margin-medium-bottom">
            <div className="ng-grid ng-flex-top ng-margin-medium-bottom">
              <div className="ng-flex-item-1">
                <Input
                  name="slug"
                  placeholder="Widget slug"
                  label="Slug*"
                  className="ng-display-block marapp-qa-inputslug"
                  error={renderErrorFor('slug')}
                  ref={register({
                    required: 'Widget slug is required',
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
          </Card>

          <Card className="ng-margin-medium-bottom">
            <div className="ng-width-1-1">
              <label className="ng-form-label" htmlFor="description">
                Description
              </label>

              <Controller
                className="marapp-qa-description"
                name="description"
                control={control}
                as={<HtmlEditor html="" />}
              />
            </div>
          </Card>

          <div className="ng-grid ng-flex-top ng-margin-medium-bottom">
            <div className="ng-width-1-2">
              <Card className="ng-margin-medium-bottom">
                <label htmlFor="provider">Widget Layer(s):</label>
                <Controller
                  as={AsyncSelect}
                  name="layers"
                  type="layers"
                  className="marapp-qa-layers"
                  control={control}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  loadFunction={LayersService.getAllLayers}
                  selectedGroup={selectedGroup}
                  isClearable={true}
                  isSearchable={true}
                  closeMenuOnSelect={false}
                  placeholder="Select layer(s)"
                />
              </Card>
            </div>
            <div className="ng-width-1-2">
              <Card>
                <label htmlFor="metrics-select">Metric Slug*</label>
                <Controller
                  as={Select}
                  control={control}
                  className="marapp-qa-metricslug"
                  name="metrics"
                  options={metricsOptions}
                  placeholder="Select metric slug"
                  styles={CUSTOM_STYLES}
                  error={renderErrorFor('metrics')}
                  theme={(theme) => ({
                    ...theme,
                    ...SELECT_THEME,
                  })}
                  rules={{ required: true }}
                />
              </Card>
            </div>
          </div>

          <Card className="ng-margin-medium-bottom">
            <label htmlFor="config">Widget Config*</label>
            <Controller
              className="marapp-qa-config"
              name="config"
              control={control}
              onChange={handleJsonChange}
              as={<JsonEditor json="" />}
            />
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
                disabled={!isValid || !dirty || jsonError || !watchJson}
              >
                Save and view details
              </button>

              <LinkWithOrg
                className="ng-button ng-button-secondary ng-button-large marapp-qa-back"
                to="/widgets"
              >
                Return to widgets home
              </LinkWithOrg>
            </div>
          )}
        </form>
      </div>
    </ContentLayout>
  );
}
