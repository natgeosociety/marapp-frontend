/*
 * Copyright 2018-2020 National Geographic Society
 *
 * Use of this software does not constitute endorsement by National Geographic
 * Society (NGS). The NGS name and NGS logo may not be used for any purpose without
 * written permission from NGS.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 * this file except in compliance with the License. You may obtain a copy of the
 * License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

import React, { useState } from 'react';

import { Modal } from '@marapp/earth-shared';
import { deleteCollection } from 'services/CollectionsService';
import { ICollection } from 'modules/collections/model';
import { EPanels } from 'modules/sidebar/model';

interface IProps {
  collection: ICollection;
  isDeleting: boolean;
  setIsDeleting: (value: boolean) => void;
  dispatch?: (p: any) => void;
}

export function CollectionDelete(props: IProps) {
  const [saveError, setSaveError] = useState('');
  const { collection, isDeleting, setIsDeleting, dispatch } = props;
  const { id, organization, name } = collection;

  return (
    <Modal isOpen={isDeleting} className="marapp-qa-DeleteConfirmation ng-text-center">
      <h4 className="ng-text-display-s ng-margin-bottom">Delete {name}</h4>
      <p className="ng-space-wrap">Are you sure you want to permanently delete this collection?</p>
      <div className="ng-flex ng-flex-center">
        <button
          autoFocus={true}
          tabIndex={0}
          className="marapp-qa-actioncancel ng-button ng-button-secondary ng-margin-medium-right"
          onClick={() => setIsDeleting(false)}
        >
          Cancel
        </button>
        <button
          className="marapp-qa-actiondelete ng-button ng-button-primary"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
      {saveError && <p className="ng-form-error-block ng-margin-bottom">{saveError}</p>}
    </Modal>
  );

  async function handleDelete() {
    try {
      await deleteCollection(id, { group: organization });

      dispatch({
        type: 'EARTH',
      });
      dispatch({
        type: 'GLOBAL/setLastViewedPlace',
        payload: null,
      });
      // TODO: move all the following side effects under the `EARTH` action
      dispatch({
        type: 'COLLECTIONS/resetCollection',
      });
      dispatch({
        type: 'PLACES/setPlacesSearch',
        payload: {
          search: '',
        },
      });
      dispatch({
        type: 'LAYERS/setLayersSearch',
        payload: {
          search: '',
        },
      });
      dispatch({
        type: 'LAYERS/resetLayers',
      });
      dispatch({
        type: 'SIDEBAR/setSidebarPanel',
        payload: EPanels.PLACES,
      });
      dispatch({
        type: 'MAP/resetMap',
      });
    } catch (e) {
      setSaveError('Something went wrong');
      console.log(e);
    }
  }
}
