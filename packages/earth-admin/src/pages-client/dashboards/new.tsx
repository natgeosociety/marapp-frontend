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
import { noop } from 'lodash';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

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
import { LinkWithOrg } from '@app/components/link-with-org';
import { ContentLayout } from '@app/layouts';
import DashboardsService from '@app/services/dashboards';
import WidgetsService from '@app/services/widgets';
import { CUSTOM_STYLES, SELECT_THEME } from '@app/theme';
import { flattenArrayForSelect } from '@app/utils';

interface IProps {
  path?: string;
  onDataChange?: () => {};
}

export function NewDashboard(props: IProps) {
  const { onDataChange = noop } = props;
  const { selectedGroup } = useAuth0();
  const { t } = useTranslation('admin');
  const { register, watch, formState, errors, setValue, control, handleSubmit } = useForm({
    mode: 'onChange',
  });

  const { touched, isDirty, isValid } = formState;
  const renderErrorFor = setupErrors(errors, touched);

  const watchName = watch('name');

  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);
  const [widgets, setWidgets] = useState();

  const onSubmit = async (values: any) => {
    const { widgets } = values;

    const parsed = {
      ...values,
      ...(!!widgets && { widgets: flattenArrayForSelect(widgets, 'id') }),
    };

    try {
      setIsLoading(true);
      const { data } = await DashboardsService.addDashboard(parsed, { group: selectedGroup });
      onDataChange();
      await navigate(`/${selectedGroup}/dashboards/${data.id}`);
    } catch (error) {
      setIsLoading(false);
      setServerErrors(error.data.errors);
    }
  };

  const generateSlug = async (e) => {
    e.preventDefault();
    try {
      const { data } = await DashboardsService.getDashboardSlug(watchName, {
        group: selectedGroup,
      });
      setValue('slug', data.slug, { shouldDirty: true, shouldValidate: true });
    } catch (error) {
      setServerErrors(error.data.errors);
    }
  };

  return (
    <ContentLayout backTo="/dashboards" className="marapp-qa-newdashboard">
      <div>
        <div className="ng-flex ng-flex-space-between">
          <h2 className="ng-text-display-m ng-c-flex-grow-1">{t('New dashboard')}</h2>
        </div>

        <form className="ng-form ng-form-dark ng-flex-column" onSubmit={handleSubmit(onSubmit)}>
          <Card className="ng-margin-medium-bottom">
            <Input
              name="name"
              placeholder={t('Dashboard title')}
              label="Title"
              required={true}
              className="ng-display-block"
              error={renderErrorFor('name')}
              ref={register({
                required: 'Dashboard title is required',
              })}
            />
          </Card>

          <Card className="ng-margin-medium-bottom">
            <div className="ng-grid ng-flex-top ng-margin-medium-bottom">
              <div className="ng-flex-item-1">
                <Input
                  name="slug"
                  placeholder={t('Dashboard slug')}
                  label="Slug"
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
          </Card>

          <Card className="ng-margin-medium-bottom">
            <div className="ng-width-1-1">
              <label className="ng-form-label" htmlFor="description">
                {t('Dashboard description')}
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
            <div className="ng-width-1-1">
              <label htmlFor="provider">{t('Included Widgets')}:</label>
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
                isClearable={true}
                isSearchable={true}
                isMulti={true}
                closeMenuOnSelect={false}
                placeholder={t('Select widgets')}
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
                disabled={!isValid || !isDirty}
              >
                {t('Save and view details')}
              </button>

              <LinkWithOrg
                className="ng-button ng-button-secondary ng-button-large marapp-qa-back"
                to="/dashboards"
              >
                {t('return to home', { value: t('dashboards') })}
              </LinkWithOrg>
            </div>
          )}
        </form>
      </div>
    </ContentLayout>
  );
}
