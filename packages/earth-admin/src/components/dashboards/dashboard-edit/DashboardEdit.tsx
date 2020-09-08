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

import { handleDashboardForm } from 'services';

import { DashboardProps } from 'components/dashboards/model';
import { HtmlEditor } from 'components/html-editor';
import { ErrorMessages } from 'components/error-messages';
import { SearchInput } from 'components/search-input';
import { LinkWithOrg } from 'components/link-with-org';
import { Auth0Context } from 'utils/contexts';

const INPUT_SIZE_CLASSNAME = 'ng-width-1-1 ng-form-large';

export default function DashboardEdit(props: DashboardProps) {
  const {
    data: {id, slug, name, description, published, layers, widgets},
    newDashboard,
  } = props;

  const {getValues, register, formState, triggerValidation, control} = useForm({
    mode: 'onChange',
  });

  const {selectedGroup} = useContext(Auth0Context);

  const [dashboardLayers, setDashboardLayers] = useState(null);
  const [dashboardWidgets, setDashboardWidgets] = useState(null);
  const [serverErrors, setServerErrors] = useState(null);

  useEffect(() => {
    setDashboardLayers(layers);
    setDashboardWidgets(widgets);
    triggerValidation();
  }, [layers, widgets]);

  async function onSubmit(e) {
    e.preventDefault();

    const formData = getValues();

    try {
      await handleDashboardForm(props.newDashboard, formData, id, selectedGroup);
      await navigate(`/${selectedGroup}/dashboards`);
    } catch (error) {
      setServerErrors(error.data.errors);
    }
  }

  return (
    <div className="marapp-qa-dashboardedit">
      <div className="ng-flex ng-flex-space-between">
        <h2 className="ng-text-display-m ng-c-flex-grow-1">
          {newDashboard ? 'Add dashboard' : `Edit Dashboard - ${name}`}
        </h2>
      </div>

      <div className="ng-padding-medium ng-background-ultradkgray">
        <form className="ng-form ng-form-dark ng-flex-column ng-width-4-5">
          <div className="ng-margin-medium-bottom ng-grid">
            <div className="ng-width-large-1-2 ng-width-1-1">
              <label className="ng-form-label" htmlFor="name">
                Dashboard name*
              </label>
              <input
                ref={register({
                  required: true,
                })}
                name="name"
                type="text"
                defaultValue={name}
                placeholder="Dashboard name"
                className={INPUT_SIZE_CLASSNAME}
              />
            </div>
            <div className="ng-width-large-1-2 ng-width-1-1">
              <label htmlFor="slug">Dashboard slug*</label>
              <input
                ref={register({
                  required: true,
                })}
                name="slug"
                type="text"
                defaultValue={slug}
                placeholder="Dashboard slug"
                className={INPUT_SIZE_CLASSNAME}
              />
            </div>
          </div>

          <div className="ng-margin-medium-bottom ng-grid">
            <div className="ng-width-large-1-1 ng-width-1-1">
              <label className="ng-form-label" htmlFor="description">
                Dashboard description
              </label>

              <Controller
                name="description"
                control={control}
                defaultValue={description}
                as={<HtmlEditor html={description}/>}
              />
            </div>
          </div>

          <div className="ng-width-1-1 ng-margin-large-vertical">
            <label htmlFor="provider">Dashboard layers:</label>
            <Controller
              name="layers"
              control={control}
              valueName={id}
              as={<SearchInput options={dashboardLayers} optionType="layers"/>}
            />
          </div>

          <div className="ng-width-1-1 ng-margin-large-vertical">
            <label htmlFor="provider">Dashboard widgets:</label>
            <Controller
              name="widgets"
              control={control}
              valueName={id}
              as={<SearchInput options={dashboardWidgets} optionType="widgets" placeholder='Search widgets to add...'/>}
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
              className="marapp-qa-actionsave ng-button ng-button-primary ng-margin-medium-right"
              onClick={onSubmit}
              disabled={!formState.isValid}
            >
              Save
            </button>

            <LinkWithOrg to="/dashboards" className="ng-button ng-button-secondary">
              Cancel
            </LinkWithOrg>
          </div>
        </form>
      </div>
    </div>
  );
}
