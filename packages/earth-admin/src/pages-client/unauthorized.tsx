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

import { Auth0Context } from '@app/utils/contexts';

export default function UnauthorizedPage(props) {
  const { t } = useTranslation(['translation', 'admin']);

  return (
    <div className="ng-background-ltgray ng-padding-large ng-height-viewport ng-flex ng-flex-center ng-text-center">
      <div className="ng-flex ng-flex-middle">
        <div>
          <h1>403</h1>
          <h2 className="ng-text-edit-m">{t('You don’t have permission to access this page')}</h2>
          <Auth0Context.Consumer>
            {({ logout }) => (
              <div className="ng-padding-medium">
                <button onClick={() => logout()} className="ng-button ng-button-primary">
                  <span className="ng-display-block">{t('Sign Out').toUpperCase()}</span>
                </button>
              </div>
            )}
          </Auth0Context.Consumer>
        </div>
      </div>
    </div>
  );
}
