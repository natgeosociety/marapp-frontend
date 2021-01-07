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

import { noop } from 'lodash';
import { merge } from 'lodash/fp';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import renderHTML from 'react-render-html';
import useSWR from 'swr';

import {
  alphaNumericDashesRule,
  AsyncSelect,
  AuthzGuards,
  Card,
  ErrorMessages,
  InlineEditCard,
  Input,
  setupErrors,
} from '@marapp/earth-shared';

import { useAuth0 } from '@app/auth/auth0';
import { DetailList } from '@app/components/detail-list';
import { HtmlEditor } from '@app/components/html-editor';
import { LinkWithOrg } from '@app/components/link-with-org';
import { DeleteConfirmation } from '@app/components/modals/delete-confirmation';
import { Toggle } from '@app/components/toggle';
import { ContentLayout } from '@app/layouts';
import { generateCacheKey } from '@app/services';
import DashboardsService from '@app/services/dashboards';
import WidgetsService from '@app/services/widgets';
import { CUSTOM_STYLES, SELECT_THEME } from '@app/theme';
import { flattenArrayForSelect, formatDate } from '@app/utils';

const DASHBOARD_DETAIL_QUERY = {
  include: 'layers,widgets',
  select: 'layers.id,layers.name,layers.type,widgets.id,widgets.name,widgets.type',
  sort: 'layers.name,widgets.name',
};

interface IProps {
  page: string;
  path: string;
  onDataChange?: () => {};
}

export function DashboardDetail(props: IProps) {
  const { page, onDataChange = noop } = props;
  const { getPermissions, selectedGroup } = useAuth0();
  const { t } = useTranslation('admin');
  const writePermissions = getPermissions(AuthzGuards.writeDashboardsGuard);

  const query = merge(DASHBOARD_DETAIL_QUERY, { group: selectedGroup });
  const cacheKey = generateCacheKey(`dashboards/${page}`, query);

  const fetcher = () =>
    DashboardsService.getDashboard(page, query).then((response: any) => response.data);
  const setter = (data) =>
    DashboardsService.handleDashboardForm(false, data, id, query).then(
      (response: any) => response.data
    );

  const { data, error, revalidate, mutate } = useSWR(cacheKey, fetcher);

  const [dashboard, setDashboard] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serverErrors, setServerErrors] = useState();

  const {
    id,
    slug,
    name,
    description,
    published,
    widgets,
    createdAt,
    updatedAt,
    version,
  }: any = dashboard;

  useEffect(() => {
    data && setDashboard(data);
  }, [data]);

  const { getValues, register, formState, errors, control } = useForm({
    mode: 'onChange',
  });

  const { touched, dirty, isValid } = formState;
  const renderErrorFor = setupErrors(errors, touched);

  async function onSubmit(e?, setIsEditing?, setIsLoading?, setServerErrors?) {
    e.preventDefault();

    const formData = getValues();

    const { widgets } = formData;

    const parsed = {
      ...formData,
      ...(widgets && { widgets: flattenArrayForSelect(widgets, 'id') }),
    };

    try {
      setIsLoading && setIsLoading(true);

      await mutate(await setter(parsed), false);

      setIsEditing && setIsEditing(false);
      setIsLoading && setIsLoading(false);
      await onDataChange();
    } catch (error) {
      setIsLoading && setIsLoading(false);
      setServerErrors && setServerErrors(error.data.errors);
    }
  }

  function handleDeleteToggle() {
    setShowDeleteModal(!showDeleteModal);
  }

  return (
    !!dashboard && (
      <ContentLayout
        backTo="/dashboards"
        isLoading={!data && !error}
        errorPage="dashboard"
        errors={error?.data?.errors}
        className="marapp-qa-dashboarddetail"
      >
        <DeleteConfirmation
          id={id}
          navigateRoute={'dashboards'}
          name={name}
          type="dashboard"
          toggleModal={handleDeleteToggle}
          onDelete={onDataChange}
          visibility={showDeleteModal}
        />
        <div className="ng-padding-medium-horizontal">
          <LinkWithOrg
            className="marapp-qa-actionreturn ng-border-remove ng-margin-bottom ng-display-inline-block"
            to="/dashboards"
          >
            <i className="ng-icon ng-icon-directionleft" />
            {t('return to home', { value: 'dashboards' })}
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
                        placeholder={t('Dashboard title')}
                        label="Title"
                        required={true}
                        defaultValue={name}
                        className="ng-display-block"
                        error={renderErrorFor('name')}
                        ref={register({
                          required: 'Dashboard title is required',
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
                          placeholder={t('Dashboard slug')}
                          label="Slug"
                          defaultValue={slug}
                          required={true}
                          className="ng-display-block marapp-qa-inputslug"
                          error={renderErrorFor('slug')}
                          ref={register({
                            required: 'Dashboard slug is required',
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
                    <p className="ng-text-weight-bold ng-margin-remove">{t('Dashboard slug')}</p>
                    <p className="ng-margin-remove ng-padding-left">{slug}</p>
                  </div>
                </InlineEditCard>
              </div>
              <div className="ng-width-1-2">
                <Card>
                  <p className="ng-margin-bottom ng-margin-top-remove">
                    <span className="ng-text-weight-bold ng-color-mdgray">{t('ID')}:</span> {id}
                  </p>
                  <p className="ng-margin-bottom ng-margin-top-remove">
                    <span className="ng-text-weight-bold ng-color-mdgray">{t('Version')}:</span>{' '}
                    {version}
                  </p>
                  <p className="ng-margin-bottom ng-margin-top-remove">
                    <span className="ng-text-weight-bold ng-color-mdgray">
                      {t('Last Updated')}:
                    </span>{' '}
                    {formatDate(updatedAt)}
                  </p>
                  <p className="ng-margin-bottom ng-margin-top-remove">
                    <span className="ng-text-weight-bold ng-color-mdgray">{t('Created')}:</span>{' '}
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
                        {t('Dashboard description')}
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
                    <p className="ng-text-weight-bold ng-margin-remove">
                      {t('Dashboard description')}
                    </p>
                    <div className="ng-margin-remove ng-padding-left">
                      {description ? renderHTML(description) : t('No description')}
                    </div>
                  </div>
                </InlineEditCard>
              </div>
            </div>
            <div className="ng-grid">
              <div className="ng-width-1-1">
                <InlineEditCard
                  onSubmit={onSubmit}
                  validForm={isValid}
                  render={({ setIsEditing, setIsLoading, setServerErrors }) => (
                    <>
                      <div className="ng-margin-medium-bottom">
                        <label htmlFor="provider">{t('Dashboard widgets')}:</label>
                        <Controller
                          name="widgets"
                          type="widgets"
                          className="marapp-qa-widgets"
                          control={control}
                          getOptionLabel={(option) => option.name}
                          getOptionValue={(option) => option.id}
                          loadFunction={WidgetsService.getAllWidgets}
                          defaultValue={widgets}
                          selectedGroup={selectedGroup}
                          as={AsyncSelect}
                          onChange={([e]) => e}
                          isClearable={true}
                          isSearchable={true}
                          isMulti={true}
                          closeMenuOnSelect={false}
                          placeholder={t('Select widgets')}
                        />
                      </div>
                    </>
                  )}
                >
                  <div className="ng-margin-medium-bottom">
                    {!!widgets ? (
                      <DetailList
                        data={widgets}
                        name={t('Dashboard Widgets')}
                        type="widgets"
                        className="ng-flex-column ng-flex-top"
                      />
                    ) : (
                      <div>
                        <p className="ng-text-weight-bold ng-margin-small-bottom">
                          {t('Dashboard widgets')}
                        </p>
                        <span className="ng-padding-left">{t('No dashboard widgets')}</span>
                      </div>
                    )}
                  </div>
                </InlineEditCard>
              </div>
            </div>
            {serverErrors && <ErrorMessages key={id} errors={serverErrors} />}
          </form>
          {writePermissions && (
            <div className="ng-text-right ng-margin-medium-top">
              <button
                className="marapp-qa-actiondelete ng-button ng-button-secondary"
                onClick={handleDeleteToggle}
              >
                {t('Delete dashboard')}
              </button>
            </div>
          )}
        </div>
      </ContentLayout>
    )
  );
}
