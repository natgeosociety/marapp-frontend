/*
 * Copyright 2018-2020 National Geographic Society
 *
 * Use of this software does not constitute endorsement by National Geographic
 * Society (NGS). The NGS name and NGS logo may not be used for any purpose without
 * written permission from NGS.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 * this file except in compliance with the License. You may obtain a copy of the
 * License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

import { ICollection } from 'modules/collections/model';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { replace } from 'redux-first-router';
import PlacesService from 'services/PlacesService';

import { TitleHero, Card, AsyncSelect, setupErrors } from '@marapp/earth-shared';

interface IProps {
  collection: ICollection;
}

export function CollectionDownloadMetrics(props: IProps) {
  const { collection } = props;
  const { t } = useTranslation();
  const { id, name, organization } = collection;
  const [saveError, setSaveError] = useState('');
  const { register, errors, handleSubmit, formState, control } = useForm({
    mode: 'onChange',
  });
  const { touched, dirty, isValid, isSubmitting } = formState;
  const renderErrorFor = setupErrors(errors, touched);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="sidebar-content-full ng-form ng-form-dark">
      <Card elevation="high" className="ng-margin-bottom">
        <TitleHero title={name} subtitle={organization} extra={t('Collection')} />
      </Card>

      <div className="scroll-container">
        <Card elevation="raised">
          <label>{t('Select metrics for download')}</label>
          <Controller
            as={AsyncSelect}
            name="metrics"
            type="metrics"
            placeholder={t('Select metrics to download data files')}
            className="marapp-qa-downloadmetricsdropdown ng-margin-medium-bottom"
            control={control}
            // defaultValue={locations}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.id}
            // loadFunction={(query) =>
            //   PlacesService.fetchPlaces({
            //     ...query,
            //     filter: ['type', '!=', LocationTypeEnum.COLLECTION].join(''),
            //     select: ['id', 'slug', 'name', 'organization'].join(','),
            //     group: organization,
            //     public: true,
            //   })
            // }
            selectedGroup={organization}
            isClearable={true}
            isSearchable={true}
            isMulti={true}
            closeMenuOnSelect={false}
          />
          <label>{t('Select a file type for download')}</label>
          <div className="legend-item-group--radio ng-margin-top ng-margin-medium-bottom">
            <div className="ng-display-inline-block ng-margin-medium-right">
              <input
                type="radio"
                id={`radio-csv`}
                value={'CSV'}
                name="organization"
                ref={register({
                  required: true,
                })}
              />
              <label htmlFor={`radio-csv`}>
                <span className="legend-item-group--symbol" />
                <span className="legend-item-group--name">CSV</span>
              </label>
            </div>
            <div className="ng-display-inline-block ng-margin-medium-left">
              <input
                type="radio"
                id={`radio-json`}
                value={'JSON'}
                name="organization"
                ref={register({
                  required: true,
                })}
              />
              <label htmlFor={`radio-json`}>
                <span className="legend-item-group--symbol" />
                <span className="legend-item-group--name">JSON</span>
              </label>
            </div>
          </div>

          {saveError && <p className="ng-form-error-block ng-margin-bottom">{saveError}</p>}

          <button
            type="submit"
            className="marapp-qa-actionsave ng-button ng-button-primary ng-margin-right"
            disabled={!isValid || isSubmitting || !dirty}
          >
            {t('Download')}
          </button>
          <button
            className="marapp-qa-actioncancel ng-button ng-button-secondary"
            // onClick={toggleEditPlaces}
          >
            {t('Cancel')}
          </button>
        </Card>
      </div>
    </form>
  );

  async function onSubmit(values) {
    // try {
    //   const { data } = await PlacesService.updatePlace(
    //     id,
    //     {
    //       name: values.name,
    //       slug: null,
    //     },
    //     { group: organization }
    //   );
    //   replace(`/collection/${organization}/${data.slug}`);
    // } catch (e) {
    //   setSaveError('Something went wrong');
    //   console.log(e);
    // }
  }
}
