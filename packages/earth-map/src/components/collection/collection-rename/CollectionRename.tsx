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
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { replace } from 'redux-first-router';

import { Card, Input, setupErrors } from '@marapp/earth-shared';

import { ICollection } from '../../../modules/collections/model';
import PlacesService from '../../../services/PlacesService';
import { CollectionConflict } from '../collection-conflict';

interface IProps {
  collection: ICollection;
  onCancel: () => void;
  toggleRenaming: (payload?: any) => void;
  mutateCollection: any;
}

export function CollectionRename(props: IProps) {
  const { collection, onCancel, mutateCollection, toggleRenaming } = props;
  const { id, slug, name, organization, version } = collection;
  const { t } = useTranslation();
  const [saveError, setSaveError] = useState('');
  const [isSaveConflict, setIsSaveConflict] = useState(false);
  const { register, errors, handleSubmit, formState, getValues } = useForm({
    mode: 'all',
  });
  const { touched, isDirty, isValid, isSubmitting } = formState;
  const renderErrorFor = setupErrors(errors, touched);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="sidebar-content-full ng-form ng-form-dark collection-rename"
    >
      <Card elevation="high" className="ng-margin-bottom header-card">
        <h3 className="ng-text-edit-s ng-margin-remove">{t('Rename Collection')}</h3>
      </Card>

      <div className="scroll-container">
        <Card elevation="raised">
          <label>
            <Input
              label={t('Name Collection')}
              placeholder={t('enter a name for your collection')}
              name="name"
              defaultValue={name}
              error={renderErrorFor('name')}
              ref={register({
                required: t('Collection name is required') as string,
              })}
            />
          </label>
        </Card>

        <Card elevation="flush">
          {saveError && <p className="ng-form-error-block ng-margin-bottom">{saveError}</p>}

          <div className="ng-flex">
            <button
              type="submit"
              disabled={!isDirty || !isValid || isSubmitting}
              className="marapp-qa-save-collection ng-button ng-button-primary ng-margin-right"
            >
              {isSubmitting ? t('Renaming collection') : t('Rename Collection')}
            </button>

            <button
              className="marapp-qa-cancel-collection ng-button ng-button-secondary"
              onClick={onCancel}
            >
              {t('Cancel')}
            </button>
          </div>
        </Card>

        {isSaveConflict && <CollectionConflict onRefresh={refresh} onOverwrite={saveAnyway} />}
      </div>
    </form>
  );

  async function onSubmit(values, optional: BaseSyntheticEvent | boolean) {
    const shouldOverwrite = isBoolean(optional);
    try {
      const { data } = await mutateCollection(
        PlacesService.updatePlace(
          id,
          {
            name: values.name,
            slug: null,
            // Sending the version to the backend will kick in the version validation
            // To keep the api backwards compatible, when no version is passed, we overwrite
            ...(!shouldOverwrite && { version }),
          },
          { group: organization }
        )
      );
      replace(`/collection/${organization}/${data.slug}`);
      onCancel();
    } catch (e) {
      if (!e) {
        setSaveError('Something went wrong');
      } else if (e.status === 404) {
        replace('/404');
      } else if (e.data.errors.find((err) => err.title === 'DocumentVersionError')) {
        setIsSaveConflict(true);
      }
    }
  }

  function refresh() {
    mutateCollection();
    toggleRenaming();
  }

  function saveAnyway() {
    const values = getValues();
    onSubmit(values, true);
  }
}
