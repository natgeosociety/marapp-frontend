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
import React from 'react';

import { Modal } from '@marapp/earth-shared';

import { useAuth0 } from '@app/auth/auth0';
import DashboardsService from '@app/services/dashboards';
import LayersService from '@app/services/layers';
import OrganizationsService from '@app/services/organizations';
import PlacesService from '@app/services/places';
import UsersService from '@app/services/users';
import WidgetsService from '@app/services/widgets';

interface IProps {
  id: string;
  navigateRoute: string;
  name: string;
  type: string;
  toggleModal: any;
  visibility?: boolean;
  onDelete?: () => void;
  error?(err: Error): void;
}

export const DeleteConfirmation = (props: IProps) => {
  const {
    id,
    navigateRoute,
    name,
    type = 'resource',
    toggleModal,
    visibility,
    error,
    onDelete = noop,
  } = props;
  const { selectedGroup } = useAuth0();

  console.log('@@@@@', id);

  async function handleDelete(e) {
    e.preventDefault();
    e.stopPropagation();

    try {
      switch (navigateRoute) {
        case 'dashboards': {
          await DashboardsService.deleteDashboards(id, { group: selectedGroup });
          break;
        }
        case 'layers': {
          await LayersService.deleteLayer(id, { group: selectedGroup });
          break;
        }
        case 'places': {
          await PlacesService.deletePlace(id, { group: selectedGroup });
          break;
        }
        case 'widgets': {
          await WidgetsService.deleteWidgets(id, { group: selectedGroup });
          break;
        }
        case 'users': {
          await UsersService.deleteUser(id, { group: selectedGroup });
          break;
        }
        case 'organizations': {
          await OrganizationsService.deleteOrganization(id);
          break;
        }
      }

      onDelete();

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
      className="marapp-qa-DeleteConfirmation ng-text-center"
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
