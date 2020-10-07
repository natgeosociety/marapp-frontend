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

import { useAuth0 } from 'auth/auth0';
import { APP_NAME, ENABLE_PUBLIC_ACCESS } from 'config';
import React from 'react';
import { replace } from 'redux-first-router';

import './styles.scss';

const VerifyEmail = () => {
  const { logout } = useAuth0();

  return (
    <div className="c-not-found marapp-qa-notfound">
      <div className="not-found--container">
        <h1 className="ng-text-display-l ng-color-ultraltgray ng-margin-medium-bottom">
          Verify Your Email
        </h1>
        <h3 className="ng-text-edit-s ng-color-ultraltgray ng-margin-small-bottom">
          One last step required.
        </h3>
        <p className="ng-margin-medium-bottom">
          Please follow the instructions in the message sent to your email account to complete the
          sign-up process. You will be able to see content when an owner assigns you to an
          organization.
        </p>
        {ENABLE_PUBLIC_ACCESS && (
          <>
            <p className="ng-margin-medium-bottom">
              Until then you can still browse content as public user by signing out. You may also
              learn more about our product{' '}
              <a href="https://github.com/natgeosociety/marapp-frontend/blob/master/ABOUT.md">
                here.
              </a>
            </p>
            <button
              className="ng-button ng-button-primary"
              onClick={() => {
                logout();
                replace('/earth');
              }}
            >
              Browse {APP_NAME} as a public user
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
