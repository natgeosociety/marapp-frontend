import * as React from 'react';

import { navigate } from 'gatsby';
import { deleteDashboards, deleteLayer, deleteLocation, deleteWidgets, deleteUser } from 'services';
import { useAuth0 } from 'auth/auth0';

import { Modal } from '@marapp/earth-components';

interface IModalProps {
  id: string;
  navigateRoute: string;
  name: string;
  toggleModal: any;
  visibility?: boolean;
}

const ActionModal = (props: IModalProps) => {
  const { id, navigateRoute, name, toggleModal, visibility } = props;
  const { selectedGroup } = useAuth0();

  async function handleDelete(e) {
    e.preventDefault();
    e.stopPropagation();

    switch (navigateRoute) {
      case 'dashboards': {
        await deleteDashboards(id, selectedGroup);
        break;
      }
      case 'layers': {
        await deleteLayer(id, selectedGroup);
        break;
      }
      case 'locations': {
        await deleteLocation(id, selectedGroup);
        break;
      }
      case 'widgets': {
        await deleteWidgets(id, selectedGroup);
        break;
      }
      case 'users': {
        await deleteUser(id, selectedGroup);
        break;
      }
    }

    await navigate(`${selectedGroup}/${navigateRoute}`, {
      state: { refresh: true },
    });

    toggleModal();
  }

  const handleModalToggle = (): void => {
    toggleModal();
  };

  return (
    <Modal isOpen={visibility} onRequestClose={handleModalToggle}>
      <p className="ng-text-edit-s ng-space-wrap">Are you sure you want to delete {name}?</p>
      <div className="ng-flex">
        <button
          className="ng-button ng-button-primary ng-margin-medium-right"
          onClick={handleModalToggle}
        >
          No
        </button>
        <button className="ng-button" onClick={(e) => handleDelete(e)}>
          Yes
        </button>
      </div>{' '}
    </Modal>
  );
};

export default ActionModal;
