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
import { useEffect, useState } from 'react';
import renderHTML from 'react-render-html';
import { Controller, useForm } from 'react-hook-form';

import {
  encodeQueryToURL,
  formatDate,
  flattenArrayForSelect,
} from 'utils';
import { useRequest } from 'utils/hooks';

import { noSpecialCharsRule, alphaNumericDashesRule, setupErrors } from 'utils/validations';

import { AsyncSelect } from '@marapp/earth-components';
import { LinkWithOrg } from 'components/link-with-org';
import { ActionModal } from 'components/action-modal';
import { Input } from 'components/input';
import { InlineEditCard } from 'components/inline-edit-card';
import { Card } from 'components/card';
import { Toggle } from 'components/toggle';
import { HtmlEditor } from 'components/html-editor';
import { DetailList } from 'components/detail-list';
import { ErrorMessages } from 'components/error-messages';

import { useAuth0 } from 'auth/auth0';
import { AuthzGuards } from 'auth/permissions';
import { ContentLayout } from 'layouts';


import { CUSTOM_STYLES, SELECT_THEME } from '../../theme';
import { getAllWidgets, getDashboard, handleDashboardForm } from 'services';

const DASHBOARD_DETAIL_QUERY = {
  include: 'layers,widgets',
  select: 'layers.id,layers.name,layers.type,widgets.id,widgets.name,widgets.type',
  sort: 'layers.name,widgets.name',
};

export function DashboardDetail(path: any) {
  const {getPermissions, selectedGroup} = useAuth0();
  const writePermissions = getPermissions(AuthzGuards.writeDashboardsGuard);

  const encodedQuery = encodeQueryToURL(`dashboards/${path.page}`, {
    ...DASHBOARD_DETAIL_QUERY,
    ...{group: selectedGroup},
  });

  const {isLoading, data} = useRequest(() => getDashboard(encodedQuery), {
    query: encodedQuery,
  });

  const [dashboard, setDashboard] = useState(data);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serverErrors, setServerErrors] = useState();

  const {
    id, slug, name, description, published, widgets, createdAt, updatedAt, version,
  } = dashboard;

  useEffect(() => {
    setDashboard(data);
  }, [data]);

  const {getValues, register, formState, errors, control} = useForm({
    mode: 'onChange',
  });

  const {touched, dirty, isValid} = formState;
  const renderErrorFor = setupErrors(errors, touched);

  async function onSubmit(e?, setIsEditing?, setIsLoading?, setServerErrors?) {
    e.preventDefault();

    const formData = getValues();

    const {widgets} = formData;

    const parsed = {
      ...formData,
      ...(widgets && {widgets: flattenArrayForSelect(widgets, 'id')}),
    };

    try {
      setIsLoading && setIsLoading(true);
      await handleDashboardForm(false, parsed, id, selectedGroup);
      const res = await getDashboard(encodedQuery);
      setDashboard(res.data);
      setIsLoading && setIsLoading(false);
      setIsEditing && setIsEditing(false);
    } catch (error) {
      setIsLoading && setIsLoading(false);
      setServerErrors && setServerErrors(error.data.errors);
    }
  }

  function handleDeleteToggle() {
    setShowDeleteModal(!showDeleteModal);
  }

  return !!dashboard && (
    <ContentLayout backTo="/dashboards" isLoading={isLoading} className="marapp-qa-dashboarddetail">
      {showDeleteModal && (
        <ActionModal
          id={id}
          navigateRoute={'dashboards'}
          name={name}
          type="dashboard"
          toggleModal={handleDeleteToggle}
          visibility={showDeleteModal}
        />
      )}
      <div className="ng-padding-medium-horizontal">
        <LinkWithOrg className="marapp-qa-actionreturn ng-border-remove ng-margin-bottom ng-display-block"
                     to="/dashboards">
          <i className="ng-icon ng-icon-directionleft"/>
          return to dashboards home
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
                      placeholder="Dashboard title"
                      label="Title*"
                      defaultValue={name}
                      className="ng-display-block"
                      error={renderErrorFor('name')}
                      ref={register({
                        required: 'Dashboard title is required',
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
                        placeholder="Dashboard slug"
                        label="Slug*"
                        defaultValue={slug}
                        className="ng-display-block marapp-qa-inputslug"
                        error={renderErrorFor('slug')}
                        ref={register({
                          required: 'Dashboard slug is required',
                          validate: {
                            alphaNumericDashesRule: alphaNumericDashesRule(),
                          },
                        })}/>
                    </div>
                  </>
                )}>
                <div className="ng-margin-medium-bottom">
                  <p className="ng-text-weight-bold ng-margin-remove">Dashboard slug</p>
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
                      Dashboard description
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
                  <p className="ng-text-weight-bold ng-margin-remove">Dashboard description</p>
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
                    <div className="ng-margin-medium-bottom">
                      <label htmlFor="provider">Dashboard widgets:</label>
                      <Controller name="widgets"
                                  type="widgets"
                                  className="marapp-qa-widgets"
                                  control={control}
                                  getOptionLabel={option => option.name}
                                  getOptionValue={option => option.id}
                                  loadFunction={getAllWidgets}
                                  defaultValue={widgets}
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
                                  placeholder="Select widgets"/>
                    </div>
                  </>
                )}>
                <div className="ng-margin-medium-bottom">
                  {!!widgets ?
                    <DetailList data={widgets} name='Dashboard Widgets' type='widgets'
                                className="ng-flex-column ng-flex-top"/> :
                    <div>
                      <p className="ng-text-weight-bold ng-margin-small-bottom">Dashboard widgets</p>
                      <span className="ng-padding-left">No dashboard widgets</span>
                    </div>}
                </div>
              </InlineEditCard>

            </div>
          </div>
          {serverErrors && <ErrorMessages key={id} errors={serverErrors}/>}
        </form>
        {writePermissions && (
          <div className="ng-text-right ng-margin-medium-top">
            <button className="ng-button ng-button-secondary" onClick={handleDeleteToggle}>
              Delete dashboard
            </button>
          </div>
        )}
      </div>
    </ContentLayout>
  );
}


