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

import React, { useState } from 'react';
import { navigate } from 'gatsby';
import { Controller, useForm } from 'react-hook-form';

import { Spinner, AsyncSelect } from '@marapp/earth-components';
import { useAuth0 } from 'auth/auth0';

import { getUniqueSlug, addDashboard } from 'services/dashboards';
import { getAllWidgets } from 'services/widgets';
import { noSpecialCharsRule, alphaNumericDashesRule, setupErrors } from 'utils/validations';
import { flattenArrayForSelect } from 'utils';

import { LinkWithOrg } from 'components/link-with-org';
import { ErrorMessages } from 'components/error-messages';
import { Card } from 'components/card';
import { Input } from 'components/input';
import { HtmlEditor } from 'components/html-editor';
import { ContentLayout } from 'layouts';

import { CUSTOM_STYLES, SELECT_THEME } from '../../theme';


export function NewDashboard() {
  const {selectedGroup} = useAuth0();

  const {register, watch, formState, errors, setValue, control, handleSubmit} = useForm({
    mode: 'onChange',
  });

  const {touched, dirty, isValid} = formState;
  const renderErrorFor = setupErrors(errors, touched);

  const watchName = watch('name');

  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);
  const [widgets, setWidgets] = useState();


  const onSubmit = async (values: any) => {
    const { widgets } = values;

    const parsed = {
      ...values,
      ...(!!widgets && {widgets: flattenArrayForSelect(widgets, 'id')}),
    };

    try {
      setIsLoading(true);
      const response = await addDashboard(parsed, selectedGroup);
      await navigate(`/${selectedGroup}/dashboards/${response.data.id}`);
    } catch (error) {
      setIsLoading(false);
      setServerErrors(error.data.errors);
    }
  };

  const generateSlug = async (e) => {
    e.preventDefault();
    try {
      const {data}: any = await getUniqueSlug(watchName, selectedGroup);
      setValue('slug', data.slug, true);
    } catch (error) {
      setServerErrors(error.data.errors);
    }
  };


  return (
    <ContentLayout backTo="/dashboards" className="marapp-qa-newdashboard">
      <div>
        <div className="ng-flex ng-flex-space-between">
          <h2 className="ng-text-display-m ng-c-flex-grow-1">New dashboard</h2>
        </div>

        <form className="ng-form ng-form-dark ng-flex-column" onSubmit={handleSubmit(onSubmit)}>
          <Card className="ng-margin-medium-bottom">
            <Input
              name="name"
              placeholder="Dashboard title"
              label="Title*"
              className="ng-display-block"
              error={renderErrorFor('name')}
              ref={register({
                required: 'Dashboard title is required',
                validate: {
                  noSpecialCharsRule: noSpecialCharsRule(),
                },
              })}/>
          </Card>

          <Card className="ng-margin-medium-bottom">
            <div className="ng-grid ng-flex-top ng-margin-medium-bottom">
              <div className="ng-flex-item-1">
                <Input
                  name="slug"
                  placeholder="Dashboard slug"
                  label="Slug*"
                  className="ng-display-block marapp-qa-inputslug"
                  error={renderErrorFor('slug')}
                  ref={register({
                    required: 'Dashboard slug is required',
                    validate: {
                      alphaNumericDashesRule: alphaNumericDashesRule(),
                    },
                  })}/>
              </div>
              <div>
                <button
                  onClick={generateSlug}
                  disabled={!watchName || !!errors.name}
                  title={watchName ? 'Generate slug' : 'Add a title first'}
                  className="ng-button ng-button-secondary ng-button-large ng-pointer marapp-qa-actiongenerateslug"
                  style={{marginTop: '36px'}}>
                  Generate a slug name
                </button>
              </div>
            </div>
          </Card>

          <Card className="ng-margin-medium-bottom">
            <div className="ng-width-1-1">
              <label className="ng-form-label" htmlFor="description">
                Dashboard description
              </label>

              <Controller
                className="marapp-qa-description"
                name="description"
                control={control}
                as={<HtmlEditor html=""/>}
              />
            </div>
          </Card>

          <Card className="ng-margin-medium-bottom">
            <div className="ng-width-1-1">
              <label htmlFor="provider">Included Widgets:</label>
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
                          isClearable
                          isSearchable
                          isMulti
                          closeMenuOnSelect={false}
                          placeholder="Select widgets"
                          styles={CUSTOM_STYLES}
                          theme={theme => ({
                            ...theme,
                            ...SELECT_THEME,
                          })}
              />
            </div>
          </Card>

          {!!serverErrors.length && <ErrorMessages errors={serverErrors}/>}
          {isLoading
            ? <div className="ng-padding-large ng-position-relative"><Spinner/></div>
            : (
              <div className="ng-flex">
                <button
                  className="ng-button ng-button-primary ng-button-large ng-margin-medium-right marapp-qa-actionsubmit"
                  disabled={!isValid || !dirty}
                >
                  Save and view details
                </button>

                <LinkWithOrg className="ng-button ng-button-secondary ng-button-large marapp-qa-back" to="/dashboard">
                  Return to dashboards home
                </LinkWithOrg>
              </div>
            )}
        </form>
      </div>
    </ContentLayout>
  );
}
