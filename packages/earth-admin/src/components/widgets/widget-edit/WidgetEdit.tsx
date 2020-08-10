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
import { useState, useEffect, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { navigate } from 'gatsby';
import { JSHINT } from 'jshint';
import { formatDate } from 'utils';

import { handleWidgetForm } from 'services';

import { WidgetProps } from 'components/widgets/model';
import { JsonEditor, HtmlEditor, ErrorMessages, SearchInput, LinkWithOrg } from 'components';
import { Auth0Context } from 'utils/contexts';

const INPUT_SIZE_CLASSNAME = 'ng-width-1-1 ng-form-large';

export default function WidgetEdit( props: WidgetProps ) {
  const {
    data: {
      id,
      name,
      updatedAt,
      createdAt,
      description,
      slug,
      category,
      layers,
      published,
      config,
      metrics,
    },
    newWidget,
  } = props;

  const { getValues, register, formState, triggerValidation, control } = useForm({
    mode: 'onChange',
    defaultValues: {
      config: config || {},
    },
  });

  const [serverErrors, setServerErrors] = useState(null);
  const [widgetConfig, setWidgetConfig] = useState({});
  const [jsonError, setJsonError] = useState(false);

  const { selectedGroup } = useContext(Auth0Context);

  useEffect(() => {
    setWidgetConfig(newWidget ? {} : config);
    triggerValidation();
  }, [config]);

  async function onSubmit( e ) {
    e.preventDefault();

    const formData = getValues();

    try {
      await handleWidgetForm(props.newWidget, formData, id, selectedGroup);
      await navigate(`${selectedGroup}/widgets`);
    } catch (error) {
      setServerErrors(error.data.errors);
    }
  }

  const handleJsonChange = ( json ) => {
    try {
      JSON.parse(json);
    } catch (err) {
      setJsonError(true);
    }
    if (!JSHINT.errors.length) {
      const parsedJson = JSON.parse(json);
      setWidgetConfig(parsedJson);
      setJsonError(false);
      return parsedJson;
    }
    setJsonError(true);
  };

  return (
    <div>
      <div className="ng-flex ng-flex-space-between">
        <h2 className="ng-text-display-m ng-c-flex-grow-1">{newWidget ? 'Add Widget' : `Edit Widget - ${name}`}</h2>

        <span>
          Last updated at: {formatDate(updatedAt)}; Created at: {formatDate(createdAt)}
        </span>
      </div>

      <div className="ng-padding-medium ng-background-ultradkgray">
        <form className="ng-form ng-flex-column ng-width-4-5">
          <div className="ng-margin-medium-bottom ng-grid">
            <div className="ng-width-large-1-2 ng-width-1-1">
              <label className="ng-form-label" htmlFor="name">
                Widget name*
              </label>
              <input
                ref={register({
                  required: true,
                })}
                name="name"
                type="text"
                defaultValue={name}
                placeholder="Widget name"
                className={INPUT_SIZE_CLASSNAME}
              />
            </div>
            <div className="ng-width-large-1-2 ng-width-1-1">
              <label htmlFor="slug">Widget slug*</label>
              <input
                ref={register({
                  required: true,
                })}
                name="slug"
                type="text"
                defaultValue={slug}
                placeholder="Widget slug"
                className={INPUT_SIZE_CLASSNAME}
              />
            </div>
          </div>

          <div className="ng-margin-medium-bottom ng-grid">
            <div className="ng-width-large-1-1 ng-width-1-1">
              <label className="ng-form-label" htmlFor="description">
                Widget description
              </label>

              <Controller
                name="description"
                control={control}
                defaultValue={description}
                as={<HtmlEditor html={description}/>}
              />
            </div>
          </div>

          {!!widgetConfig && (
            <div className="ng-margin-medium-bottom ng-margin-large-top">
              <label className="ng-form-label" htmlFor="description">
                Widget config
              </label>

              <Controller
                name="config"
                control={control}
                defaultValue={widgetConfig}
                onChange={( widgetConfig ) => handleJsonChange(widgetConfig)}
                as={<JsonEditor json={widgetConfig}/>}
              />
            </div>
          )}

          <div className="ng-width-large-1-2 ng-width-1-1">
            <label htmlFor="metrics">Metric slug*</label>
            <input
              ref={register({
                required: true,
              })}
              name="metrics"
              type="text"
              defaultValue={metrics}
              placeholder="Metric slug"
              className={INPUT_SIZE_CLASSNAME}
            />
          </div>

          <div className="ng-width-1-1 ng-margin-large-vertical">
            <label htmlFor="provider">Widget layers:</label>
            <Controller
              name="layers"
              control={control}
              valueName={id}
              as={<SearchInput options={layers} optionType="layers"/>}
            />
          </div>

          <div className="ng-margin-medium-bottom">
            <input
              ref={register}
              name="published"
              id="published"
              type="checkbox"
              defaultChecked={published}
              className="ng-margin-right"
            />
            <label htmlFor="published">Published?</label>
          </div>

          {serverErrors && <ErrorMessages errors={serverErrors}/>}
          <div className="ng-flex">
            <button
              className="ng-button ng-button-primary ng-margin-medium-right"
              onClick={onSubmit}
              disabled={!formState.isValid || jsonError}
            >
              Save
            </button>

            <LinkWithOrg className="ng-button" to="/widgets">
              Cancel
            </LinkWithOrg>
          </div>
        </form>
      </div>
    </div>
  );
}
