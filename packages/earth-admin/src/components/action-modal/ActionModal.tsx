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

import { Modal } from '@marapp/earth-shared';
import { useAuth0 } from 'auth/auth0';
import { navigate } from 'gatsby';
import React from 'react';
import {
  deleteDashboards,
  deleteLayer,
  deleteOrganization,
  deletePlace,
  deleteUser,
  deleteWidgets,
} from 'services';

interface IModalProps {
  id: string;
  navigateRoute: string;
  name: string;
  type: string;
  toggleModal: any;
  visibility?: boolean;
  error?(err: Error): void;
}

const ActionModal = (props: IModalProps) => {
  const { id, navigateRoute, name, type = 'resource', toggleModal, visibility, error } = props;
  const { selectedGroup } = useAuth0();

  async function handleDelete(e) {
    e.preventDefault();
    e.stopPropagation();

    try {
      switch (navigateRoute) {
        case 'dashboards': {
          await deleteDashboards(id, selectedGroup);
          break;
        }
        case 'layers': {
          await deleteLayer(id, selectedGroup);
          break;
        }
        case 'places': {
          await deletePlace(id, selectedGroup);
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
        case 'organizations': {
          await deleteOrganization(id);
          break;
        }
      }

      await navigate(`/${selectedGroup}/${navigateRoute}`, {
        state: { refresh: true },
      });
    } catch (err) {
      error && error(err);
    }

    toggleModal();
  }

  const handleModalToggle = (): void => {
    toggleModal();
  };

  return (
    <Modal
      isOpen={visibility}
      onRequestClose={handleModalToggle}
      className="marapp-qa-actionmodal ng-text-center"
    >
      <h4 className="ng-text-display-s ng-margin-bottom">Delete {name}</h4>
      <p className="ng-space-wrap">Are you sure you want to permanently delete this {type}?</p>
      <div className="ng-flex ng-flex-center">
        <button
          autoFocus={true}
          tabIndex={0}
          className="marapp-qa-actioncancel ng-button ng-button-secondary ng-margin-medium-right"
          onClick={handleModalToggle}
        >
          Cancel
        </button>
        <button
          className="marapp-qa-actiondelete ng-button ng-button-primary"
          onClick={(e) => handleDelete(e)}
        >
          Delete
        </button>
      </div>{' '}
    </Modal>
  );
};

export default ActionModal;
