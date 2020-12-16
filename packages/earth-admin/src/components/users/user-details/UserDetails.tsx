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

import { noop } from 'lodash';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AuthzGuards, ErrorMessages } from '@marapp/earth-shared';

import { useAuth0 } from '@app/auth/auth0';
import { LinkWithOrg } from '@app/components/link-with-org';
import { DeleteConfirmation } from '@app/components/modals/delete-confirmation';
import { normalizeGroupName } from '@app/utils';

import { UserProps } from '../model';

export default function UserDetails(props: UserProps) {
  const {
    data: { name, email, groups, id },
    onDataChange = noop,
  } = props;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serverErrors, setServerErrors] = useState(null);

  const { getPermissions } = useAuth0();
  const { t } = useTranslation('admin');
  const writePermissions = getPermissions(AuthzGuards.writeUsersGuard);

  function handleDeleteToggle() {
    setShowDeleteModal(!showDeleteModal);
  }

  function handleDeleteError(error) {
    setServerErrors(error.data.errors);
  }

  return (
    <div className="marapp-qa-userdetails">
      <DeleteConfirmation
        id={id}
        navigateRoute={'users'}
        name={name}
        type="user"
        toggleModal={handleDeleteToggle}
        visibility={showDeleteModal}
        onDelete={onDataChange}
        error={handleDeleteError}
      />
      <div className="ng-flex ng-flex-space-between">
        <h2 className="ng-text-display-m ng-c-flex-grow-1">{name}</h2>
      </div>

      <div className="ng-padding-medium ng-background-ultradkgray ng-margin-medium-bottom">
        <h3 className="ng-text-display-s">{t('User details')}</h3>

        <p>
          <span className="ng-text-weight-medium">{t('Email')}:</span> {email || '-'}
        </p>
        <p>
          <span className="ng-text-weight-medium">{t('Name')}: </span> {name || '-'}
        </p>
        <p>
          <span className="ng-text-weight-medium">{t('Roles')}:</span>{' '}
          {groups.map((group) => normalizeGroupName(group.name)).join(', ') || '-'}
        </p>
      </div>
      <div className="ng-padding-medium ng-background-ultradkgray ng-margin-medium-bottom">
        {writePermissions && (
          <LinkWithOrg
            to={`/users/${id}/edit`}
            className="marapp-qa-actionedit ng-button ng-button-primary ng-margin-medium-right"
          >
            {t('Edit user')}
          </LinkWithOrg>
        )}
        <LinkWithOrg className="marapp-qa-actionback ng-button ng-button-secondary" to="/users">
          {t('Go back to users list')}
        </LinkWithOrg>
      </div>
      {serverErrors && <ErrorMessages errors={serverErrors} />}
      {writePermissions && (
        <div className="ng-padding-medium ng-background-ultradkgray ng-text-right">
          <button
            className="marapp-qa-actiondelete ng-button ng-button-primary"
            onClick={handleDeleteToggle}
          >
            {t('Delete user')}
          </button>
        </div>
      )}
    </div>
  );
}
