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

import { Button } from '@marapp/earth-shared';

import './styles.scss';

const VerifyEmail = ({ resetStore }) => {
  const { logout } = useAuth0();

  return (
    <div className="c-not-found marapp-qa-notfound">
      <div className="not-found--container">
        <h1 className="ng-text-display-l ng-color-primary">Confirm your email</h1>
        <h3 className="ng-text-display-m ng-color-ultraltgray">One last step needed. </h3>
        <p className="ng-text-edit-s">
          Please follow the instructions in the message sent to your email account to complete the
          sign-up process. <br />
          You will be able to see content when an owner assigns you to an organization.
        </p>
        {ENABLE_PUBLIC_ACCESS && (
          <>
            <p>Until then you can still browse content as public user by logging out.</p>
            <Button
              onClick={() => {
                logout();
              }}
              className="-light"
            >
              Browse {APP_NAME} as a public user
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
