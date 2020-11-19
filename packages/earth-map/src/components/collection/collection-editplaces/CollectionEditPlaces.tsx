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
import { LocationTypeEnum } from 'modules/places/model';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import PlacesService from 'services/PlacesService';

import { AsyncSelect, Card, TitleHero } from '@marapp/earth-shared';

interface IProps {
  collection: ICollection;
  placesFromGroups: string[];
  setMapBounds: (payload: any) => void;
  setCollectionData: (payload: any) => void;
  toggleEditPlaces: () => void;
}

export function CollectionEditPlaces(props: IProps) {
  const { collection, placesFromGroups, setCollectionData, setMapBounds, toggleEditPlaces } = props;
  const { t } = useTranslation();
  const { id, organization, name, locations } = collection;
  const [saveError, setSaveError] = useState('');
  const { control, handleSubmit, formState } = useForm({
    mode: 'onChange',
  });
  const { isValid, isSubmitting, dirty } = formState;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="sidebar-content-full">
      <Card elevation="high" className="ng-margin-bottom">
        <TitleHero title={name} subtitle={organization} extra={t('Collection')} />
      </Card>

      <div className="scroll-container">
        <Card elevation="raised">
          <label>{t('Add places')}:</label>
          <Controller
            as={AsyncSelect}
            name="locations"
            type="places"
            label={t('Add places')}
            placeholder={t('Add places to your collection')}
            className="marapp-qa-locationsdropdown ng-margin-medium-bottom"
            control={control}
            defaultValue={locations}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.id}
            loadFunction={(query) =>
              PlacesService.fetchPlaces({
                ...query,
                filter: ['type', '!=', LocationTypeEnum.COLLECTION].join(''),
                select: ['id', 'slug', 'name', 'organization'].join(','),
                group: organization,
                public: true,
              })
            }
            selectedGroup={organization}
            isClearable={true}
            isSearchable={true}
            isMulti={true}
            closeMenuOnSelect={false}
          />

          {saveError && <p className="ng-form-error-block ng-margin-bottom">{saveError}</p>}

          <button
            type="submit"
            className="marapp-qa-actionsave ng-button ng-button-primary ng-margin-right"
            disabled={!isValid || isSubmitting || !dirty}
          >
            {isSubmitting ? t('Saving') : t('Save')}
          </button>
          <button
            className="marapp-qa-actioncancel ng-button ng-button-secondary"
            onClick={toggleEditPlaces}
          >
            {t('Cancel')}
          </button>
        </Card>
      </div>
    </form>
  );

  async function onSubmit(values) {
    const parsedValues = {
      ...values,

      // The api expects an array of ids or an empty array
      // should this be handled by AsyncSelect?
      ...(values.locations ? { locations: values.locations.map((x) => x.id) } : { locations: [] }),
    };

    try {
      const { data } = await PlacesService.updateCollection(id, parsedValues, {
        group: organization,
        include: 'locations',
        select: 'locations.slug,locations.name',
      });
      setCollectionData(data);
      setSaveError(null);

      if (data.bbox2d.length) {
        setMapBounds({ bbox: data.bbox2d });
      }
      toggleEditPlaces();
    } catch (e) {
      setSaveError('Something went wrong');
      console.log(e);
    }
  }
}
