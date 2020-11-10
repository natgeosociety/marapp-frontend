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
import React, { useEffect, useState } from 'react';
import ProfileService from 'services/ProfileService';

import { Spinner } from '@marapp/earth-shared';
import Link from 'redux-first-router-link';
import './styles.scss';
import { PUBLIC_URL } from 'config';
import { APP_LOGO } from 'theme';

enum ChangeEmailStates {
  VERIFIED = 'Email Change Successful. Please sign in with your new email to continue with your update.',
  ERROR = 'Email Update Error',
  PENDING = 'Change Email. Please sign in with your original account email to continue with your update.',
}

export default function ChangeEmailComponent() {
  const { login, isAuthenticated } = useAuth0();
  const [errorPage, setErrorPage] = useState('');

  useEffect(() => {
    const fn = async () => {
      try {
        console.log('try');
        const hashParameter = window.location.hash;
        const hashQuery = hashParameter.split('#')[1];
        const params = new URLSearchParams(hashQuery);

        const accessToken = params.get('access_token');
        const error = params.get('error');
        const error_description = params.get('error_description');

        if (!isAuthenticated) {
          localStorage.setItem('emailToken', accessToken);
          return login({
            appState: { targetUrl: '/profile/change-email' },
            emailState: error ? error_description : ChangeEmailStates['PENDING'],
          });
        } else {
          const emailToken = localStorage.getItem('emailToken');
          if (emailToken) {
            console.log('email token');
            const response = await ProfileService.changeEmailConfirmation({
              accessToken: emailToken,
            });
            if (response && response?.data?.success) {
              // Auth0 sessions are reset when a user’s email or password changes;
              // force a re-login if email change request successful;
              localStorage.removeItem('emailToken');
              return login({
                appState: { targetUrl: '/profile' },
                emailState: ChangeEmailStates['VERIFIED'],
              });
            }
          }
          if (error || error_description) {
            console.log(error_description, 'aici');
            setErrorPage(error_description);
          }
        }
      } catch (e) {
        return login({
          appState: { targetUrl: '/profile/change-email' },
          emailState: e,
        });
      }
    };
    fn();
  });

  if (errorPage) {
    return ErrorPage(errorPage);
  }

  return <Spinner size="large" />;
}

const ErrorPage = (error) => (
  <div className="verified-page marapp-qa-verify-email">
    <div className="verified-container">
      <a href={`${PUBLIC_URL}earth`} className="ng-border-remove">
        <img src={APP_LOGO} className="marapp-qa-logo ng-margin" />
      </a>
      <p className="ng-text-weight-bold ng-color-ultraltgray ng-margin-medium-bottom">Oops!</p>
      <p className="ng-margin-medium-bottom">{error}</p>
      <Link
        to={{ type: 'PROFILE' }}
        className="ng-button ng-button-secondary ng-width-1-1 marapp-qa-resendemail"
      >
        return to profile
      </Link>
    </div>
  </div>
);
