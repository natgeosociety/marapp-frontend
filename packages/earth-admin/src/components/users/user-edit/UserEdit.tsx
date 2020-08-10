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
import { useState, useContext } from 'react';
import { UserEditProps } from '../model';
import { useForm, Controller } from 'react-hook-form';
import { LinkWithOrg, SearchInput, ErrorMessages } from 'components';
import { handleUserForm } from 'services/users';
import { Auth0Context } from 'utils/contexts';
import { navigate } from 'gatsby';

const INPUT_SIZE_CLASSNAME = 'ng-width-1-1 ng-form-large';

export default function UserEdit(props: UserEditProps) {
  const {
    data: { name, email, groups, id },
    newUser,
  } = props;

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
      await navigate(`/${selectedGroup}/users`);
    } catch (error) {
      setServerErrors(error.data.errors);
    }
  };

  return (
    <div>
      <div className="ng-flex ng-flex-space-between">
        <h2 className="ng-text-display-m">{newUser ? 'Add user' : `Edit User - ${name}`}</h2>
      </div>

      <div className="ng-padding-medium ng-background-ultradkgray">
        <form className="ng-form ng-flex-column ng-width-4-5" onSubmit={handleSubmit(onSubmit)}>
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
                disabled
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
              className="ng-button ng-button-primary ng-margin-medium-right"
              disabled={!formState.isValid || selectedGroups.length === 0}
            >
              Save
            </button>
            <LinkWithOrg className="ng-button" to="/users">
              Cancel
            </LinkWithOrg>
          </div>
        </form>
      </div>
    </div>
  );
}
