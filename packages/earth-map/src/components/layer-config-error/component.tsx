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
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Card } from '@marapp/earth-shared';

import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_WIDE } from '../../config';
import './styles.scss';

interface IProps {
  open?: boolean;
  selectedOpen?: boolean;
  resetLayersActive?: () => void;
}

const LayerConfigError = (props: IProps) => {
  const { open, resetLayersActive, selectedOpen } = props;
  const { t } = useTranslation();

  const containerStyle = {
    marginLeft: 0,
  };

  if (open) {
    containerStyle.marginLeft = SIDEBAR_WIDTH;

    if (selectedOpen) {
      containerStyle.marginLeft = SIDEBAR_WIDTH_WIDE;
    }
  }

  return (
    <div
      className="marapp-qa-layer-error layer-config-error ng-padding-large"
      style={containerStyle}
    >
      <h1 className="ng-text-display-m ng-margin-medium-bottom ng-form-error-block">OOPS!</h1>
      <div className="ng-grid">
        <div className="ng-width-1-2">
          <Card>
            <p className="ng-color-white">{t('Invalid layer configuration specified')}.</p>
            <div className="ng-flex ng-flex-center">
              <button
                className="ng-button ng-button-secondary marapp-qa-reset-filters"
                onClick={resetLayersActive}
              >
                {t('Reset layers')}
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LayerConfigError;
