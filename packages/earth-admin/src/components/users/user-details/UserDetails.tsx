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
import { useState } from 'react';
import { UserProps } from '../model';
import { useAuth0 } from 'auth/auth0';
import { AuthzGuards } from 'auth/permissions';
import { ActionModal } from 'components/action-modal';
import { LinkWithOrg } from 'components/link-with-org';
import { ErrorMessages } from 'components/error-messages';

export default function UserDetails(props: UserProps) {
  const {
    data: {name, email, groups, id},
  } = props;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serverErrors, setServerErrors] = useState(null);

  const {getPermissions} = useAuth0();
  const writePermissions = getPermissions(AuthzGuards.writeUsersGuard);

  function handleDeleteToggle() {
    setShowDeleteModal(!showDeleteModal);
  }

  function handleDeleteError(error) {
    setServerErrors(error.data.errors);
  }

  return (
    <div className="marapp-qa-userdetails">
      {showDeleteModal && (
        <ActionModal
          id={id}
          navigateRoute={'users'}
          name={name}
          type="user"
          toggleModal={handleDeleteToggle}
          visibility={showDeleteModal}
          error={handleDeleteError}
        />
      )}
      <div className="ng-flex ng-flex-space-between">
        <h2 className="ng-text-display-m ng-c-flex-grow-1">{name}</h2>
      </div>

      <div className="ng-padding-medium ng-background-ultradkgray ng-margin-medium-bottom">
        <h3 className="ng-text-display-s">User details</h3>

        <p>
          <span className="ng-text-weight-medium">Email:</span> {email || '-'}
        </p>
        <p>
          <span className="ng-text-weight-medium">Name: </span> {name || '-'}
        </p>
        <p>
          <span className="ng-text-weight-medium">Groups:</span>{' '}
          {groups.map((group) => group.name).join(', ') || '-'}
        </p>
      </div>
      <div className="ng-padding-medium ng-background-ultradkgray ng-margin-medium-bottom">
        {writePermissions && (
          <LinkWithOrg
            to={`/users/${id}/edit`}
            className="marapp-qa-actionedit ng-button ng-button-primary ng-margin-medium-right"
          >
            Edit user
          </LinkWithOrg>
        )}
        <LinkWithOrg className="marapp-qa-actionback ng-button ng-button-secondary" to="/users">
          Go back to users list
        </LinkWithOrg>
      </div>
      {serverErrors && <ErrorMessages errors={serverErrors}/>}
      {writePermissions && (
        <div className="ng-padding-medium ng-background-ultradkgray ng-text-right">
          <button className="marapp-qa-actiondelete ng-button ng-button-primary" onClick={handleDeleteToggle}>
            Delete user
          </button>
        </div>
      )}
    </div>
  );
}
