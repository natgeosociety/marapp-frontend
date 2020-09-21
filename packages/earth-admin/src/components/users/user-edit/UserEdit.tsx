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
import React, { useContext, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { ErrorMessages } from '@marapp/earth-shared';
import { LinkWithOrg } from '@app/components/link-with-org';
import { SearchInput } from '@app/components/search-input';
import { handleUserForm } from '@app/services/users';
import { Auth0Context } from '@app/utils/contexts';

import { UserEditProps } from '../model';

const INPUT_SIZE_CLASSNAME = 'ng-width-1-1 ng-form-large';

export default function UserEdit(props: UserEditProps) {
  const { data, newUser, onDataChange = noop } = props;

  const { name, email, groups, id } = data || {};

  const { handleSubmit, register, errors, control, getValues, formState } = useForm({
    mode: 'onChange',
  });
  const [serverErrors, setServerErrors] = useState(null);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const { selectedGroup } = useContext(Auth0Context);

  const onSubmit = async (values: any) => {
    const formData = getValues();

    try {
      await handleUserForm(false, { groups: selectedGroups }, id || formData.email, selectedGroup);
      onDataChange();
      await navigate(`/${selectedGroup}/users`);
    } catch (error) {
      setServerErrors(error.data.errors);
    }
  };

  return (
    <div className="marapp-qa-useredit">
      <div className="ng-flex ng-flex-space-between">
        <h2 className="ng-text-display-m">{newUser ? 'Add user' : `Edit User - ${name}`}</h2>
      </div>

      <div className="ng-padding-medium ng-background-ultradkgray">
        <form
          className="ng-form ng-form-dark ng-flex-column ng-width-4-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="ng-margin-medium-bottom ng-grid">
            <div className="ng-width-large-1-2 ng-width-1-1">
              <label className="ng-form-label" htmlFor="name">
                User name
              </label>
              <input
                ref={register}
                name="name"
                type="text"
                defaultValue={name}
                placeholder="User name"
                className={INPUT_SIZE_CLASSNAME}
                disabled={true}
              />
            </div>
            <div className="ng-width-large-1-2 ng-width-1-1">
              <label htmlFor="email">User email*</label>
              <input
                ref={register({
                  required: true,
                })}
                name="email"
                type="text"
                defaultValue={email}
                placeholder="User email"
                className={INPUT_SIZE_CLASSNAME}
                disabled={!newUser}
              />
            </div>
          </div>

          <div className="ng-margin-medium-bottom">
            <label htmlFor="role">User groups*</label>
            <Controller
              name="groups"
              control={control}
              valueName={id}
              onChange={(data) => setSelectedGroups(data.flat())}
              as={
                <SearchInput
                  options={groups}
                  optionType="userGroups"
                  placeholder="Search groups..."
                />
              }
            />
          </div>

          {serverErrors && <ErrorMessages errors={serverErrors} />}

          <div className="ng-flex">
            <button
              className="marapp-qa-actionsave ng-button ng-button-primary ng-margin-medium-right"
              disabled={!formState.isValid || selectedGroups.length === 0}
            >
              Save
            </button>
            <LinkWithOrg
              className="marapp-qa-actioncancel ng-button ng-button-secondary"
              to="/users"
            >
              Cancel
            </LinkWithOrg>
          </div>
        </form>
      </div>
    </div>
  );
}
