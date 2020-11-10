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
import { useForm } from 'react-hook-form';
import { replace } from 'redux-first-router';
import Link from 'redux-first-router-link';
import { createCollection } from 'services/CollectionsService';

import { Card, Input, setupErrors } from '@marapp/earth-shared';

interface IProps {
  privateGroups: string[];
}

const CollectionNew = (props: IProps) => {
  const { privateGroups } = props;
  const canCreateCollection = !!privateGroups.length;
  const [saveError, setSaveError] = useState(null);
  const { handleSubmit, register, errors, formState } = useForm({ mode: 'onChange' });
  const { touched, dirty, isValid, isSubmitting } = formState;
  const renderErrorFor = setupErrors(errors, touched);

  const onSubmit = async (values) => {
    try {
      const { data } = await createCollection(values, {
        group: values.organization,
      });
      replace(`/collection/${data.organization}/${data.slug}`);
    } catch (e) {
      if (typeof e === 'undefined') {
        return setSaveError('Unable to create collection. You might be offline');
      } else if (e?.data?.errors.length) {
        const [firstError] = e.data.errors;
        return setSaveError(firstError.detail);
      }
    }
  };

  return (
    <form
      className="marapp-qa-collection-new ng-form ng-form-dark"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Card elevation="high" className="ng-margin-bottom">
        <h3 className="ng-text-edit-s ng-margin-remove">Create a Collection</h3>
      </Card>

      {canCreateCollection && (
        <Card className="ng-margin-bottom">
          <label>
            <Input
              label="Name Collection"
              placeholder="enter a name for your collection"
              name="name"
              error={renderErrorFor('name')}
              ref={register({
                required: 'Collection name is required',
              })}
            />
          </label>
        </Card>
      )}

      <Card className="c-legend-item-group">
        <h2 className="ng-text-display-s ng-body-color ng-margin-bottom">Select an Organization</h2>
        <p>
          {canCreateCollection
            ? `Please select an organization to create a collection under. After selecting an
          organization, you will be able to select places and share insights with members of your
          selected organization. Organizations can not be edited once picked.`
            : `You don't have rights to create a new collection`}
        </p>
        <div className="legend-item-group--radio ng-padding-medium-left">
          {privateGroups.map((group) => (
            <div>
              <input
                type="radio"
                id={`radio-${group}`}
                value={group}
                name="organization"
                ref={register({
                  required: true,
                })}
              />
              <label htmlFor={`radio-${group}`}>
                <span className="legend-item-group--symbol" />
                <span className="legend-item-group--name">{group}</span>
              </label>
            </div>
          ))}
        </div>
      </Card>

      <Card elevation="flush">
        {saveError && <p className="ng-form-error-block ng-margin-bottom">{saveError}</p>}
        <button
          disabled={!isValid || !dirty || isSubmitting || !canCreateCollection}
          type="submit"
          className="marapp-qa-save-collection ng-button ng-button-primary ng-margin-right"
        >
          Create Collection
        </button>
        <Link
          to={{ type: 'EARTH' }}
          className="marapp-qa-cancel-collection ng-button ng-button-secondary"
        >
          Cancel
        </Link>
      </Card>
    </form>
  );
};

export default CollectionNew;
