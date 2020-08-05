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
import { OrganizationEditProps } from '../model';
import { useForm } from 'react-hook-form';
import { LinkWithOrg, ErrorMessages } from 'components';
import { addOrganization, updateOrganization } from 'services/organizations';
import { Auth0Context } from 'utils/contexts';
import { navigate } from 'gatsby';

const INPUT_SIZE_CLASSNAME = 'ng-width-1-1 ng-form-large';

export default function OrganizationEdit(props: OrganizationEditProps) {
  const {
    data: { name, owners, description, id },
    newOrg,
  } = props;

  const { handleSubmit, register, errors, control, getValues, formState } = useForm({
    mode: 'onChange',
  });
  const [serverErrors, setServerErrors] = useState(null);
  const { selectedGroup } = useContext(Auth0Context);

  const onSubmit = async (values: any) => {
    const formData = getValues();

    try {
      if (newOrg) {
        await addOrganization({
          name: formData.name,
          description: formData.description,
          owners: [].concat(formData.owners)
        }, selectedGroup);
      }
      else {
        await updateOrganization(id || formData.id, {
          description: formData.description,
          owners: [].concat(formData.owners)
        }, selectedGroup);
      }
      await navigate(`/${selectedGroup}/organizations`);
    } catch (error) {
      setServerErrors(error.data.errors);
    }
  };

  return (
    <div>
      <div className="ng-flex ng-flex-space-between">
        <h2 className="ng-text-display-m">{newOrg ? 'Add organization' : `Edit Organization - ${name}`}</h2>
      </div>

      <div className="ng-padding-medium ng-background-white">
        <form className="ng-form ng-flex-column ng-width-4-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="ng-margin-medium-bottom ng-grid">
            <div className="ng-width-large-1-2 ng-width-1-1">
              <label className="ng-form-label" htmlFor="name">
                Organization name
              </label>
              <input
                ref={register({
                  required: true,
                })}
                name="name"
                type="text"
                defaultValue={name}
                placeholder="Organization name"
                className={INPUT_SIZE_CLASSNAME}
                disabled={!newOrg}
              />
            </div>
            <div className="ng-width-large-1-2 ng-width-1-1">
              <label className="ng-form-label" htmlFor="owners">
                Organization owner
              </label>
              <input
                ref={register({
                  required: true,
                })}
                name="owners"
                type="text"
                defaultValue={owners ? owners[0] : ''}
                placeholder="Organization owner"
                className={INPUT_SIZE_CLASSNAME}
              />
            </div>
            <div className="ng-width-large-1-2 ng-width-1-1">
              <label htmlFor="email">Organization description*</label>
              <input
                ref={register({
                  required: true,
                })}
                name="description"
                type="text"
                defaultValue={description}
                placeholder="Organization description"
                className={INPUT_SIZE_CLASSNAME}
              />
            </div>
          </div>

          {serverErrors && <ErrorMessages errors={serverErrors} />}

          <div className="ng-flex">
            <button
              className="ng-button ng-button-primary ng-margin-medium-right"
              disabled={!formState.isValid}
            >
              Save
            </button>
            <LinkWithOrg className="ng-button" to="/organizations">
              Cancel
            </LinkWithOrg>
          </div>
        </form>
      </div>
    </div>
  );
}
