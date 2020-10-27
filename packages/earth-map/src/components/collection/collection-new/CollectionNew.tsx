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

import React from 'react';
import Link from 'redux-first-router-link';
import { useForm } from 'react-hook-form';

import { Card, Input, setupErrors } from '@marapp/earth-shared';

const CollectionNew = () => {
  const { handleSubmit, register, errors, formState } = useForm({ mode: 'onChange' });
  const { touched, dirty, isValid } = formState;
  const renderErrorFor = setupErrors(errors, touched);

  const onSubmit = (values) => {
    console.log(values);
  };

  return (
    <form className="ng-form ng-form-dark" onSubmit={handleSubmit(onSubmit)}>
      <Card elevation="high" className="ng-margin-bottom">
        <h3 className="ng-text-edit-s ng-margin-remove">Create a Collection</h3>
      </Card>

      <Card className="ng-margin-bottom">
        <label>
          <Input
            label="Name Collection"
            placeholder="enter a name for your collection"
            name="name"
            error={renderErrorFor('name')}
            ref={register({
              required: 'This is required',
            })}
          />
        </label>
      </Card>

      <Card className="c-legend-item-group">
        <h2 className="ng-text-display-s ng-body-color ng-margin-bottom">Select an Organization</h2>
        <p>
          Please select an organization to create a collection under. After selecting an
          organization, you will be able to select places and share insights with members of your
          selected organization. Organizations can not be edited once picked.
        </p>
        <div className="legend-item-group--radio ng-padding-medium-left">
          <div>
            <input
              type="radio"
              id="marapp"
              value="Marapp"
              name="org"
              ref={register({
                required: true,
              })}
            />
            <label htmlFor="marapp">
              <span className="legend-item-group--symbol" />
              <span className="legend-item-group--name">Marapp</span>
            </label>
          </div>
          <div>
            <input
              type="radio"
              id="unbl"
              name="org"
              value="UNBL"
              ref={register({
                required: true,
              })}
            />
            <label htmlFor="unbl">
              <span className="legend-item-group--symbol" />
              <span className="legend-item-group--name">UNBL</span>
            </label>
          </div>
        </div>
      </Card>

      <Card elevation="flush">
        <button
          disabled={!isValid || !dirty}
          type="submit"
          className="ng-button ng-button-primary ng-margin-right"
        >
          Create Collection
        </button>
        <Link to={{ type: 'EARTH' }} className="ng-button ng-button-secondary">
          Cancel
        </Link>
      </Card>
    </form>
  );
};

export default CollectionNew;
