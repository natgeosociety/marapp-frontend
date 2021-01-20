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

import isBoolean from 'lodash/isBoolean';
import React, { BaseSyntheticEvent, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { replace } from 'redux-first-router';

import { AsyncSelect, Card, DropdownItem, TitleHero } from '@marapp/earth-shared';

import { MAP_ENABLE_PUBLIC_ACCESS } from '../../../config';
import { ICollection } from '../../../modules/collections/model';
import { LocationTypeEnum } from '../../../modules/places/model';
import PlacesService from '../../../services/PlacesService';
import { CollectionConflict } from '../collection-conflict';

interface IProps {
  collection: ICollection;
  setMapBounds: (payload?: any) => void;
  setCollectionData: (payload?: any) => void;
  toggleEditPlaces: () => void;
  reloadCollection: (payload?: any) => void;
}

export function CollectionEditPlaces(props: IProps) {
  const { collection, setCollectionData, setMapBounds, toggleEditPlaces, reloadCollection } = props;
  const { t } = useTranslation();
  const { id, slug, organization, name, locations, version } = collection;
  const [saveError, setSaveError] = useState('');
  const [isSaveConflict, setIsSaveConflict] = useState(false);
  const { control, handleSubmit, formState, getValues } = useForm({
    mode: 'all',
  });
  const { isValid, isSubmitting, isDirty } = formState;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="sidebar-content-full collection-edit-places">
      <Card elevation="high" className="ng-margin-bottom header-card">
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
            getOptionLabel={(option, extra) => {
              const itemProps: any = {
                title: option.name,
              };

              if (MAP_ENABLE_PUBLIC_ACCESS) {
                itemProps.subtitle = option.organization;
              }

              return <DropdownItem {...itemProps} />;
            }}
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
            className="marapp-qa-actionsave ng-button ng-button-primary ng-margin-right"
            disabled={!isValid || isSubmitting || !isDirty}
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

        {isSaveConflict && <CollectionConflict onRefresh={refresh} onOverwrite={saveAnyway} />}
      </div>
    </form>
  );

  /**
   * Receives event when called by react-hook-form and boolean when called by us
   */
  async function onSubmit(values, optional: BaseSyntheticEvent | boolean) {
    const shouldOverwrite = isBoolean(optional);
    const parsedValues = {
      ...values,

      // The api expects an array of ids or an empty array
      // should this be handled by AsyncSelect?
      ...(values.locations ? { locations: values.locations.map((x) => x.id) } : { locations: [] }),
      // Sending the version to the backend will kick in the version validation
      // To keep the api backwards compatible, when no version is passed, we overwrite
      ...(!shouldOverwrite && { version }),
    };

    try {
      const { data } = await PlacesService.updateCollection(id, parsedValues, {
        group: organization,
        include: 'locations',
      });
      setCollectionData(data);
      resetErrors();

      // someone changed the slug, redirect to the new collection
      if (slug !== data.slug) {
        replace(`/collection/${organization}/${data.slug}`);
      }

      if (data.bbox2d.length) {
        setMapBounds({ bbox: data.bbox2d });
      }
      toggleEditPlaces();
    } catch (e) {
      if (!e) {
        setSaveError('Something went wrong');
      } else if (e.status === 404) {
        replace('/404');
      } else if (e.data.errors.find((err) => err.title === 'DocumentVersionError')) {
        setIsSaveConflict(true);
      }
      console.log(e);
    }
  }

  function refresh() {
    reloadCollection({ organization, id, slug });
    toggleEditPlaces();
  }

  function saveAnyway() {
    const values = getValues();
    onSubmit(values, true);
  }

  function resetErrors() {
    setSaveError(null);
    setIsSaveConflict(false);
  }
}
