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
import { navigate } from 'gatsby';

import { formatDate } from 'utils';

import { useForm, Controller } from 'react-hook-form';
import { JSHINT } from 'jshint';

import { LayerProps, LayerType, LayerProvider, LayerCategory } from '../model';

import { JsonEditor } from 'components/json-editor';
import { HtmlEditor } from 'components/html-editor';
import { ErrorMessages } from 'components/error-messages';
import { LinkWithOrg } from 'components/link-with-org';
import { handleLayerForm } from 'services/layers';
import { SearchInput } from 'components/search-input';
import { Auth0Context } from 'utils/contexts';

const INPUT_SIZE_CLASSNAME = 'ng-width-1-1 ng-form-large';

export default function LayerEdit(props: LayerProps) {
  const {
    data: {
      id,
      name,
      description,
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
    },
    newLayer,
  } = props;

  const { getValues, register, formState, triggerValidation, control } = useForm({
    mode: 'onChange',
  });

  const [serverErrors, setServerErrors] = useState(null);
  const [layerConfig, setLayerConfig] = useState();
  const [jsonError, setJsonError] = useState(false);
  const [layerCategory, setLayerCategory] = useState([]);

  const { selectedGroup } = useContext(Auth0Context);

  useEffect(() => {
    setLayerConfig(newLayer ? {} : config);
    !!category && setLayerCategory(category);

    triggerValidation();
  }, [config, layerCategory]);

  async function onSubmit(e) {
    e.preventDefault();

    const formData = getValues();

    try {
      await handleLayerForm(props.newLayer, formData, id, selectedGroup);
      await navigate(`${selectedGroup}/layers`);
    } catch (error) {
      setServerErrors(error.data.errors);
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

  return (
    <div>
      <div className="ng-flex ng-flex-space-between">
        <h2 className="ng-text-display-m ng-c-flex-grow-1">{ newLayer ? 'Add Layer' : `Edit Layer - ${name}` }</h2>

        <span>
          Last updated at: {formatDate(updatedAt)}; Created at: {formatDate(createdAt)}
        </span>
      </div>

      <div className="ng-padding-medium ng-background-white">
        <form className="ng-form ng-flex-column ng-width-4-5">
          <div className="ng-margin-medium-bottom ng-grid">
            <div className="ng-width-large-1-2 ng-width-1-1">
              <label className="ng-form-label" htmlFor="name">
                Layer name*
              </label>
              <input
                ref={register({
                  required: true,
                })}
                name="name"
                type="text"
                defaultValue={name}
                placeholder="Layer name"
                className={INPUT_SIZE_CLASSNAME}
              />
            </div>
            <div className="ng-width-large-1-2 ng-width-1-1">
              <label htmlFor="slug">Layer slug*</label>
              <input
                ref={register({
                  required: true,
                })}
                name="slug"
                type="text"
                defaultValue={slug}
                placeholder="Layer slug"
                className={INPUT_SIZE_CLASSNAME}
              />
            </div>
          </div>
          <div className="ng-margin-medium-bottom ng-grid">
            <div className="ng-width-large-1-1 ng-width-1-1">
              <label className="ng-form-label" htmlFor="description">
                Layer description
              </label>

              <Controller
                name="description"
                control={control}
                defaultValue={description}
                as={<HtmlEditor html={description} />}
              />
            </div>
          </div>

          <div className="ng-margin-medium-bottom ng-grid">
            <div className="ng-width-large-1-2 ng-width-1-1">
              <label htmlFor="type">Layer type</label>
              <select
                className="ng-width-1-1 ng-form-large"
                id="type"
                ref={register}
                name="type"
                defaultValue={type}
              >
                {Object.keys(LayerType).map((t, idx) => (
                  <option key={idx} value={t} selected={type === t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="ng-width-large-1-2 ng-width-1-1">
              <label htmlFor="provider">Layer provider*</label>
              <select
                className="ng-width-1-1 ng-form-large"
                id="provider"
                ref={register}
                name="provider"
                defaultValue={provider}
              >
                {Object.keys(LayerProvider).map((p, idx) => (
                  <option key={idx} value={p} selected={provider === p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="ng-margin-medium-bottom ng-grid">
            <div className="ng-width-large-1-2 ng-width-1-1">
              <label htmlFor="category">Layer category*</label>
              <select
                className="ng-width-1-1 ng-form-large"
                multiple
                id="category"
                ref={register({
                  required: true,
                })}
                name="category"
                defaultValue={layerCategory}
              >
                {Object.keys(LayerCategory).map((c, idx) => (
                  <option
                    key={idx}
                    value={LayerCategory[c]}
                    selected={layerCategory.find((layer) => layer === LayerCategory[c])}
                  >
                    {LayerCategory[c]}
                  </option>
                ))}
              </select>
            </div>
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

          <div className="ng-width-1-1 ng-margin-large-vertical">
            <label htmlFor="provider">Included layers:</label>
            <Controller
              name="references"
              control={control}
              valueName={id}
              as={<SearchInput options={references} optionType="layers" />}
            />
          </div>

          {!!layerConfig && (
            <div className="ng-margin-medium-bottom">
              <label htmlFor="config">Layer Config</label>
              <Controller
                name="config"
                control={control}
                defaultValue={layerConfig}
                onChange={(layerConfig) => handleJsonChange(layerConfig)}
                as={<JsonEditor json={layerConfig} />}
              />
            </div>
          )}

          {serverErrors && <ErrorMessages errors={serverErrors} />}
          <div className="ng-flex">
            <button
              className="ng-button ng-button-primary ng-margin-medium-right"
              onClick={onSubmit}
              disabled={!formState.isValid || jsonError}
            >
              Save
            </button>

            <LinkWithOrg className="ng-button" to="/layers">
              Cancel
            </LinkWithOrg>
          </div>
        </form>
      </div>
    </div>
  );
}
