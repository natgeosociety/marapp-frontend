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
import { useState } from 'react';
import { navigate } from 'gatsby';
import { useForm } from 'react-hook-form';
import { Spinner } from '@marapp/earth-components';
import { noop } from 'lodash';

import { useAuth0 } from 'auth/auth0';
import { addPlace, getUniqueSlug } from 'services/places';
import { PlaceTypeEnum } from './model';
import { noSpecialCharsRule, setupErrors } from 'utils/validations';

import { LinkWithOrg } from 'components/link-with-org';
import { ErrorMessages } from 'components/error-messages';
import { Card } from 'components/card';
import { FakeJsonUpload } from 'components/fake-json-upload';
import { Input } from 'components/input';
import { ContentLayout } from 'layouts';

interface IProps {
  path: string;
  onDataChange?: () => {};
}

export function NewPlace(props: IProps) {
  const { onDataChange = noop } = props;
  const { getValues, register, watch, formState, errors, setValue } = useForm({
    mode: 'onChange',
  });
  const { touched, dirty, isValid } = formState;
  const watchName = watch('name');
  const [isLoading, setIsLoading] = useState(false);
  const [geojsonValue, setGeojson] = useState(null);
  const [serverErrors, setServerErrors] = useState([]);
  const [jsonError, setJsonError] = useState(false);
  const { selectedGroup } = useAuth0();
  const renderErrorFor = setupErrors(errors, touched);

  async function onSubmit(e) {
    e.preventDefault();

    const formData = getValues();
    const parsed = {
      ...formData,
      geojson: geojsonValue,
    }
    try {
      setIsLoading(true);
      const response: any = await addPlace(parsed, selectedGroup);
      onDataChange();
      await navigate(`/${selectedGroup}/places/${response.data.id}`);
    } catch (error) {
      setIsLoading(false);
      setServerErrors(error.data.errors);
    }
  }
  const generateSlug = async (e) => {
    e.preventDefault();
    try {
      const { data }: any = await getUniqueSlug(watchName, selectedGroup);
      setValue('slug', data.slug, true);
    } catch (error) {
      setServerErrors(error.data.errors);
    }
  }

  return (
    <ContentLayout backTo="/places" className="marapp-qa-placesnew">
      <div>
        <div className="ng-flex ng-flex-space-between">
          <h2 className="ng-text-display-m ng-c-flex-grow-1">New place</h2>
        </div>

        <form className="ng-form ng-form-dark ng-flex-column ng-width-4-5">
          <Card className="ng-margin-medium-bottom">
            <Input
              name="name"
              placeholder="Place title"
              label="Title*"
              className="ng-display-block"
              error={renderErrorFor('name')}
              ref={register({
                required: 'Place title is required',
                validate: {
                  noSpecialCharsRule: noSpecialCharsRule()
                }
              })} />
          </Card>

          <Card className="ng-margin-medium-bottom">
            <div className="ng-margin-medium-bottom">
              <label htmlFor="input-type">Place type*</label>
              <select
                className="ng-width-1-1 ng-form-large"
                id="input-type"
                ref={register({
                  required: true,
                })}
                name="type"
              >
                {Object.keys(PlaceTypeEnum).map((t, idx) => (
                  <option
                    key={idx}
                    value={PlaceTypeEnum[t]}
                  >
                    {PlaceTypeEnum[t]}
                  </option>
                ))}
              </select>
            </div>

            <div className="ng-grid ng-flex-top">
              <div className="ng-flex-item-1">
                <Input
                  name="slug"
                  placeholder="Place slug"
                  label="Slug*"
                  className="ng-display-block"
                  error={renderErrorFor('slug')}
                  ref={register({
                    required: 'Slug is required',
                  })} />
              </div>
              <div>
                <button
                  onClick={generateSlug}
                  disabled={!watchName || !!errors.name}
                  title={watchName ? 'Generate slug' : 'Add a title first'}
                  className="marapp-qa-actiongenerateslug ng-button ng-button-secondary ng-button-large ng-pointer"
                  style={{ marginTop: '36px' }}>
                  Generate a slug name
                </button>
              </div>
            </div>

          </Card>

          <Card className="ng-margin-medium-bottom">
            <p>Choose a GeoJSON to calculate shape maths and geographic relationships.</p>
            <FakeJsonUpload
              name="geojson"
              label="Place shape*"
              ref={register({
                required: 'GeoJSON is required',
              })}
              onChange={(json) => {
                setGeojson(json);
                setJsonError(false);
              }}
              onError={(err) => setJsonError(true)} />
          </Card>

          {!!serverErrors.length && <ErrorMessages errors={serverErrors} />}

          {isLoading
            ? <div className="ng-padding-large ng-position-relative"><Spinner /></div>
            : (
              <div className="ng-flex">
                <button
                  className="marapp-qa-actionsave ng-button ng-button-primary ng-button-large ng-margin-medium-right"
                  onClick={onSubmit}
                  disabled={!isValid || jsonError || !dirty}
                >
                  Save and view details
                </button>

                <LinkWithOrg className="marapp-qa-actionreturn ng-button ng-button-secondary ng-button-large" to="/places">
                  Return to places home
                </LinkWithOrg>
              </div>
            )}
        </form>
      </div>
    </ContentLayout>
  );
}
