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
import Select from 'react-select';

import { Card, ErrorMessages, Input, setupErrors, Spinner, Tab, Tabs } from '@marapp/earth-shared';

import { useAuth0 } from '@app/auth/auth0';
import { FakeJsonUpload } from '@app/components/fake-json-upload';
import { JsonEditor } from '@app/components/json-editor';
import { LinkWithOrg } from '@app/components/link-with-org';
import { ContentLayout } from '@app/layouts';
import PlacesService from '@app/services/places';
import { CUSTOM_STYLES, SELECT_THEME } from '@app/theme';
import { flattenObjectForSelect } from '@app/utils';

interface IProps {
  path: string;
  onDataChange?: () => {};
  dynamicOptions?: {
    type?: any[];
  };
}

export function NewPlace(props: IProps) {
  const { onDataChange = noop, dynamicOptions } = props;
  const { type: placeTypeOptions = [] } = dynamicOptions;
  const { register, handleSubmit, watch, formState, errors, setValue, reset, control } = useForm({
    mode: 'onChange',
  });
  const { touched, dirty, isValid } = formState;
  const watchName = watch('name');
  const [isLoading, setIsLoading] = useState(false);
  const [geojsonValue, setGeojson] = useState(null);
  const [serverErrors, setServerErrors] = useState([]);
  const [jsonError, setJsonError] = useState(false);
  const [panel, setPanel] = useState('upload');
  const { selectedGroup } = useAuth0();
  const { t } = useTranslation('admin');
  const renderErrorFor = setupErrors(errors, touched);

  const switchGeojsonTab = (e) => {
    setPanel(e);
    setGeojson(null);
    setJsonError(true);
  };

  async function onSubmit(values) {
    const { type } = values;
    const parsed = {
      ...values,
      ...(type && { type: flattenObjectForSelect(type, 'value') }),
      geojson: geojsonValue,
    };

    try {
      setIsLoading(true);
      const { data } = await PlacesService.addPlace(parsed, { group: selectedGroup });
      onDataChange();
      await navigate(`/${selectedGroup}/places/${data.id}`);
    } catch (error) {
      // TODO: Remove this when the real "upload file" feature is available.
      const fallbackError = [
        {
          detail: `${t(
            'Something went wrong'
          )}. ${t('Please make sure the selected file is under MB', { value: 6 })}`,
        },
      ];

      setIsLoading(false);
      setServerErrors(error?.data.errors || fallbackError);
    }
  }

  const generateSlug = async (e) => {
    e.preventDefault();
    try {
      const { data } = await PlacesService.getPlaceSlug(watchName, { group: selectedGroup });
      setValue('slug', data.slug, true);
    } catch (error) {
      setServerErrors(error.data.errors);
    }
  };

  return (
    <ContentLayout backTo="/places" className="marapp-qa-placesnew">
      <div>
        <div className="ng-flex ng-flex-space-between">
          <h2 className="ng-text-display-m ng-c-flex-grow-1">{t('New place')}</h2>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="ng-form ng-form-dark ng-flex-column ng-width-4-5"
        >
          <div className="ng-grid ng-margin-medium-bottom">
            <div className="ng-width-1-1">
              <Card>
                <Input
                  name="name"
                  placeholder={t('Place title')}
                  label="Title"
                  required={true}
                  className="marapp-qa-placetitle ng-display-block"
                  error={renderErrorFor('name')}
                  ref={register({
                    required: 'Place title is required',
                  })}
                />
              </Card>
            </div>
          </div>

          <Card className="ng-margin-medium-bottom">
            <div className="ng-margin-medium-bottom">
              <label htmlFor="type">{t('Place type')}*</label>
              <Controller
                as={Select}
                control={control}
                name="type"
                options={placeTypeOptions}
                placeholder={t('Select place type')}
                styles={CUSTOM_STYLES}
                error={renderErrorFor('type')}
                theme={(theme) => ({
                  ...theme,
                  ...SELECT_THEME,
                })}
                rules={{ required: true }}
                className="marapp-qa-placetype"
              />
            </div>

            <div className="ng-grid ng-flex-top">
              <div className="ng-flex-item-1">
                <Input
                  name="slug"
                  placeholder={t('Place slug')}
                  label="Slug"
                  required={true}
                  className="marapp-qa-placeslug ng-display-block"
                  error={renderErrorFor('slug')}
                  ref={register({
                    required: 'Place slug is required',
                  })}
                />
              </div>
              <div>
                <button
                  onClick={generateSlug}
                  disabled={!watchName || !!errors.name}
                  title={t(watchName ? 'Generate slug' : 'Add a title first')}
                  className="marapp-qa-actiongenerateslug ng-button ng-button-secondary ng-button-large ng-pointer"
                  style={{ marginTop: '36px' }}
                >
                  {t('Generate a slug name')}
                </button>
              </div>
            </div>
          </Card>

          <Card className="ng-margin-medium-bottom">
            <>
              <Tabs value={panel} onChange={switchGeojsonTab} className="ng-ep-background-dark">
                <Tab label={t('Shape File')} value="upload" />
                <Tab label={t('Json editor')} value="json" />
              </Tabs>
              {panel === 'upload' && (
                <>
                  <p>
                    {t('Choose a GeoJSON to calculate shape maths and geographic relationships')}
                  </p>
                  <FakeJsonUpload
                    name="geojson"
                    type=".geojson"
                    label={`${t('Place shape')}*`}
                    ref={register({
                      required: 'GeoJSON is required',
                    })}
                    onChange={(json) => {
                      setGeojson(json);
                      setJsonError(false);
                    }}
                    onError={(err) => setJsonError(true)}
                  />
                </>
              )}
              {panel === 'json' && (
                <div className="ng-margin-medium-bottom">
                  <JsonEditor
                    json={geojsonValue}
                    onChange={(json) => setGeojson(json)}
                    onError={(e) => setJsonError(e)}
                  />
                </div>
              )}
            </>
          </Card>

          {!!serverErrors.length && <ErrorMessages errors={serverErrors} />}

          {isLoading ? (
            <div className="ng-padding-large ng-position-relative">
              <Spinner />
            </div>
          ) : (
            <div className="ng-flex">
              <button
                className="marapp-qa-actionsave ng-button ng-button-primary ng-button-large ng-margin-medium-right"
                disabled={!isValid || jsonError || !dirty}
              >
                {t('Save and view details')}
              </button>

              <LinkWithOrg
                className="marapp-qa-actionreturn ng-button ng-button-secondary ng-button-large"
                to="/places"
              >
                {t('return to home', { value: t('places') })}
              </LinkWithOrg>
            </div>
          )}
        </form>
      </div>
    </ContentLayout>
  );
}
