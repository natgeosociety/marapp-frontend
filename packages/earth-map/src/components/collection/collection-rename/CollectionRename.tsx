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
import { useForm } from 'react-hook-form';
import { replace } from 'redux-first-router';
import PlacesService from 'services/PlacesService';

import { Card, Input, setupErrors } from '@marapp/earth-shared';

interface IProps {
  collection: ICollection;
  onCancel: () => void;
}

export function CollectionRename(props: IProps) {
  const { collection, onCancel } = props;
  const { t } = useTranslation();
  const { id, name, organization } = collection;
  const [saveError, setSaveError] = useState('');
  const { register, errors, handleSubmit, formState } = useForm({
    mode: 'onChange',
  });
  const { touched, dirty, isValid, isSubmitting } = formState;
  const renderErrorFor = setupErrors(errors, touched);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="sidebar-content-full ng-form ng-form-dark">
      <Card elevation="high" className="ng-margin-bottom">
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

          <button
            type="submit"
            disabled={!dirty || !isValid || isSubmitting}
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
        </Card>
      </div>
    </form>
  );

  async function onSubmit(values) {
    try {
      const { data } = await PlacesService.updatePlace(
        id,
        {
          name: values.name,
          slug: null,
        },
        { group: organization }
      );
      replace(`/collection/${organization}/${data.slug}`);
      onCancel();
    } catch (e) {
      setSaveError('Something went wrong');
      console.log(e);
    }
  }
}
