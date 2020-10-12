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
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import renderHTML from 'react-render-html';
import Select from 'react-select';
import useSWR from 'swr';

import {
  AsyncSelect,
  AuthzGuards,
  ErrorMessages,
  InlineEditCard,
  Input,
  alphaNumericDashesRule,
  setupErrors,
} from '@marapp/earth-shared';

import { useAuth0 } from '@app/auth/auth0';
import { Card } from '@app/components/card';
import { DetailList } from '@app/components/detail-list';
import { HtmlEditor } from '@app/components/html-editor';
import { JsonEditor } from '@app/components/json-editor';
import { LinkWithOrg } from '@app/components/link-with-org';
import { DeleteConfirmation } from '@app/components/modals/delete-confirmation';
import { Toggle } from '@app/components/toggle';
import { ContentLayout } from '@app/layouts';
import { getAllLayers } from '@app/services/layers';
import { getWidget, handleWidgetForm } from '@app/services/widgets';
import { CUSTOM_STYLES, SELECT_THEME } from '@app/theme';
import { copyToClipboard, encodeQueryToURL, flattenObjectForSelect, formatDate } from '@app/utils';

import { Widget, WidgetProps } from './model';

const WIDGET_DETAIL_QUERY = {
  include: 'layers',
  select: 'layers.id,layers.name,layers.type',
  sort: 'layers.name',
};

export function WidgetsDetail(props: WidgetProps) {
  const { page, onDataChange = noop, groupedFilters = {} } = props;
  const { metrics = [] } = groupedFilters;
  const { getPermissions, selectedGroup } = useAuth0();
  const writePermissions = getPermissions(AuthzGuards.writeLayersGuard);

  const encodedQuery = encodeQueryToURL(`widgets/${page}`, {
    ...WIDGET_DETAIL_QUERY,
    ...{ group: selectedGroup },
  });

  const { data, error, mutate } = useSWR(encodedQuery, (url) =>
    getWidget(url).then((res: any) => res.data)
  );

  const [widget, setWidget] = useState<Widget>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jsonError, setJsonError] = useState(false);
  const [serverErrors, setServerErrors] = useState(null);
  const [widgetConfig, setWidgetConfig] = useState(null);
  const [collapseJson, setCollapseJson] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const textAreaRef = useRef(null);

  const {
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
    metrics: selectedMetrics,
    version,
  } = widget;

  useEffect(() => {
    data && setWidget(data);
  }, [data]);

  useEffect(() => {
    config && setWidgetConfig(config);
  }, [widget]);

  const { getValues, register, formState, errors, control } = useForm({
    mode: 'onChange',
  });

  const { touched, dirty, isValid } = formState;
  const renderErrorFor = setupErrors(errors, touched);

  async function onSubmit(e?, setIsEditing?, setIsLoading?, setServerErrors?) {
    e.preventDefault();
    const formData = getValues();
    const { layers, metrics } = formData;

    const parsed = {
      ...formData,
      ...(layers && { layers: [flattenObjectForSelect(layers, 'id')] }),
      ...(metrics && { metrics: [metrics.value] }),
    };

    try {
      setIsLoading && setIsLoading(true);
      await handleWidgetForm(false, parsed, id, selectedGroup);
      await mutate();
      onDataChange();
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
      setWidgetConfig(parsedJson);
      setJsonError(false);
      return parsedJson;
    }
    setJsonError(true);
  };

  function handleDeleteToggle() {
    setShowDeleteModal(!showDeleteModal);
  }

  return (
    !!widget && (
      <ContentLayout
        backTo="/widgets"
        isLoading={!data && !error}
        errorPage="widget"
        errors={error?.data?.errors}
        className="marapp-qa-widgetdetail"
      >
        <DeleteConfirmation
          id={id}
          navigateRoute="widgets"
          name={name}
          type="widget"
          toggleModal={handleDeleteToggle}
          onDelete={onDataChange}
          visibility={showDeleteModal}
        />
        <div className="ng-padding-medium-horizontal">
          <LinkWithOrg
            className="marapp-qa-actionreturn ng-border-remove ng-margin-bottom ng-display-block"
            to="/widgets"
          >
            <i className="ng-icon ng-icon-directionleft" />
            return to widgets home
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
                        placeholder="Widget title"
                        label="Title*"
                        defaultValue={name}
                        className="ng-display-block"
                        error={renderErrorFor('name')}
                        ref={register({
                          required: 'Widget title is required',
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
                          placeholder="Slug"
                          label="Slug"
                          defaultValue={slug}
                          className="ng-display-block marapp-qa-inputslug"
                          error={renderErrorFor('slug')}
                          ref={register({
                            required: 'Slug is required',
                            validate: {
                              alphaNumericDashesRule: alphaNumericDashesRule(),
                            },
                          })}
                        />
                      </div>
                    </>
                  )}
                >
                  <div className="ng-margin-medium-bottom">
                    <p className="ng-text-weight-bold ng-margin-remove">Slug</p>
                    <p className="ng-margin-remove ng-padding-left">{slug}</p>
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
                    <span className="ng-text-weight-bold ng-color-mdgray">Last Updated:</span>{' '}
                    {formatDate(updatedAt)}
                  </p>
                  <p className="ng-margin-bottom ng-margin-top-remove">
                    <span className="ng-text-weight-bold ng-color-mdgray">Created:</span>{' '}
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
                        Description
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
                    <p className="ng-text-weight-bold ng-margin-remove">Description</p>
                    <div className="ng-margin-remove ng-padding-left">
                      {description ? renderHTML(description) : 'No description'}
                    </div>
                  </div>
                </InlineEditCard>
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
                        <label htmlFor="provider">Widget Layer(s)</label>
                        <Controller
                          name="layers"
                          type="layers"
                          className="marapp-qa-layers"
                          control={control}
                          getOptionLabel={(option) => option.name}
                          getOptionValue={(option) => option.id}
                          loadFunction={getAllLayers}
                          defaultValue={layers}
                          selectedGroup={selectedGroup}
                          as={AsyncSelect}
                          onChange={([e]) => e}
                          isClearable={true}
                          isSearchable={true}
                          styles={CUSTOM_STYLES}
                          theme={(theme) => ({
                            ...theme,
                            ...SELECT_THEME,
                          })}
                          closeMenuOnSelect={false}
                          placeholder="Select layer(s)"
                        />
                      </div>
                    </>
                  )}
                >
                  <div className="ng-margin-medium-bottom">
                    {!!layers ? (
                      <DetailList
                        data={layers}
                        name="Widget Layer(s)"
                        type="layers"
                        className="ng-flex-column ng-flex-top"
                      />
                    ) : (
                      <div>
                        <p className="ng-text-weight-bold ng-margin-small-bottom">
                          Widget Layer(s)
                        </p>
                        <span className="ng-padding-left">No layer references</span>
                      </div>
                    )}
                  </div>
                </InlineEditCard>
              </div>
              <div className="ng-width-1-2">
                <InlineEditCard
                  onSubmit={onSubmit}
                  validForm={isValid}
                  render={() => (
                    <>
                      <label htmlFor="metrics-select">Metric Slug*</label>
                      <Controller
                        as={Select}
                        control={control}
                        className="marapp-qa-metricslug"
                        name="metrics"
                        options={metrics.map((m) => ({
                          value: m.value,
                          label: m.value,
                        }))}
                        defaultValue={{
                          value: selectedMetrics[0],
                          label: selectedMetrics[0],
                        }}
                        placeholder="Select metric slug"
                        styles={CUSTOM_STYLES}
                        error={renderErrorFor('metrics')}
                        theme={(theme) => ({
                          ...theme,
                          ...SELECT_THEME,
                        })}
                        rules={{ required: true }}
                      />
                    </>
                  )}
                >
                  <div>
                    <p className="ng-text-weight-bold ng-margin-small-bottom">Metric Slug</p>
                    <div className="ng-margin-remove ng-padding-left">{selectedMetrics}</div>
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
                        <label htmlFor="config">Widget Config</label>
                        <Controller
                          name="config"
                          control={control}
                          defaultValue={widgetConfig}
                          onChange={handleJsonChange}
                          as={<JsonEditor json={widgetConfig} />}
                        />
                      </div>
                    </>
                  )}
                >
                  <div className="ng-margin-medium-bottom">
                    {config && (
                      <div>
                        <p className="ng-flex">
                          <span className="ng-text-weight-medium">Widget Config</span>
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
                Delete widget
              </button>
            </div>
          )}
        </div>
      </ContentLayout>
    )
  );
}
