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
import { useTranslation } from 'react-i18next';

import { Modal } from '@marapp/earth-shared';

interface IProps {
  onRefresh: (payload?: any) => void;
  onOverwrite: (payload?: any) => void;
}

export function CollectionConflict(props: IProps) {
  const { onOverwrite, onRefresh } = props;
  const [isOverwriting, setIsOverwriting] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Modal
        parentSelector={() => document.querySelector('.sidebar-content-full')}
        isOpen={true}
        className="ng-text-center save-collection-modal"
      >
        <h4 className="ng-text-display-s ng-margin-bottom">{t('Update warning')}</h4>
        <p className="ng-space-wrap">
          {t(
            'An update to this collection was made while you were in edit mode. Saving your edits will overide any other updates that were made to the collection. Please refresh this page to view updates made by others, or continue saving.'
          )}
        </p>
        <button
          tabIndex={0}
          className="marapp-qa-actionrefresh ng-button ng-button-primary ng-margin-right"
          onClick={onRefresh}
        >
          {t('Refresh')}
        </button>
        <button
          className="marapp-qa-actionsaveanyway ng-button ng-button-secondary"
          onClick={() => {
            setIsOverwriting(true);
            onOverwrite();
          }}
          disabled={isOverwriting}
        >
          {isOverwriting ? t('Saving') : t('Save anyway')}
        </button>
      </Modal>
      <div id="inner-modal" />
    </>
  );
}
