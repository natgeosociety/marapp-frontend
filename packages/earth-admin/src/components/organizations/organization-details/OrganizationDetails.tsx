import * as React from 'react';
import { useState } from 'react';
import { OrganizationProps } from '../model';
import { useAuth0 } from '../../../auth/auth0';
import { AuthzGuards } from 'auth/permissions';
import { ActionModal } from 'components/action-modal';
import { LinkWithOrg } from 'components/LinkWithOrg';

export default function OrganizationDetails(props: OrganizationProps) {
  const {
    data: { name, description, id },
  } = props;
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { getPermissions } = useAuth0();
  const writePermissions = getPermissions(AuthzGuards.writeUsersGuard);

  function handleDeleteToggle() {
    setShowDeleteModal(!showDeleteModal);
  }

  return (
    <div>
      {showDeleteModal && (
        <ActionModal
          id={id}
          navigateRoute={'organizations'}
          name={name}
          toggleModal={handleDeleteToggle}
          visibility={showDeleteModal}
        />
      )}
      <div className="ng-flex ng-flex-space-between">
        <h2 className="ng-text-display-m ng-c-flex-grow-1">{name}</h2>
      </div>

      <div className="ng-padding-medium ng-background-white ng-margin-medium-bottom">
        <h3 className="ng-text-display-s">Organization details</h3>

        <p>
          <span className="ng-text-weight-medium">Name:</span> {name || '-'}
        </p>
        <p>
          <span className="ng-text-weight-medium">Description: </span> {description || '-'}
        </p>
      </div>
      <div className="ng-padding-medium ng-background-white ng-margin-medium-bottom">
        {writePermissions && (
          <LinkWithOrg
            to={`/organizations/${id}/edit`}
            className="ng-button ng-button-primary ng-margin-medium-right"
          >
            Edit organization
          </LinkWithOrg>
        )}
        <LinkWithOrg className="ng-button" to="/organizations">
          Go back to organizations list
        </LinkWithOrg>
      </div>
      {writePermissions && (
        <div className="ng-padding-medium ng-background-white ng-text-right">
          <button className="ng-button ng-button-primary" onClick={handleDeleteToggle}>
            Delete organization
          </button>
        </div>
      )}
    </div>
  );
}
