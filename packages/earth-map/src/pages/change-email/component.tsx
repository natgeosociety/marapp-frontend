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
import { PUBLIC_URL } from 'config';
import React, { useEffect, useState } from 'react';
import { replace } from 'redux-first-router';
import Link from 'redux-first-router-link';
import ProfileService from 'services/ProfileService';
import { APP_LOGO } from 'theme';

import { Spinner } from '@marapp/earth-shared';

import './styles.scss';

enum ChangeEmailStates {
  VERIFIED = 'Email change successful. Please sign in with your new email to continue with your update.',
  PENDING = 'Change email. Please sign in with your original account email to continue with your update.',
  ERROR = 'Email update error.',
}

export default function ChangeEmailComponent() {
  const { login, isAuthenticated } = useAuth0();
  const [errorPage, setErrorPage] = useState('');

  useEffect(() => {
    const fn = async () => {
      const hashParameter = window.location.hash;
      const hashQuery = hashParameter.split('#')[1];
      const params = new URLSearchParams(hashQuery);

      const accessToken = params.get('access_token');
      const error = params.get('error');
      const error_description = params.get('error_description');

      if (!isAuthenticated) {
        // preserve path, query and hash params when redirecting;
        const target = window.location.href.replace(window.location.origin, '');
        // save target URL to redirect to after login;
        return login({ appState: { targetUrl: target }, emailState: ChangeEmailStates.PENDING });
      }

      if (accessToken) {
        try {
          const response = await ProfileService.changeEmailConfirmation({ accessToken });
          if (response && response?.data?.success) {
            // Auth0 sessions are reset when a user’s email or password changes;
            // force a re-login if email change request successful;
            return login({
              appState: { targetUrl: '/profile' },
              emailState: ChangeEmailStates.VERIFIED,
            });
          }
        } catch (err) {
          setErrorPage(ChangeEmailStates.ERROR);
        }
      } else if (error || error_description) {
        if (error === 'unauthorized') {
          setErrorPage(error_description);
        } else {
          setErrorPage(ChangeEmailStates.ERROR);
        }
      } else {
        replace('/profile');
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
  <div className="change-page marapp-qa-change-email">
    <div className="change-container">
      <a href={`${PUBLIC_URL}earth`} className="ng-border-remove">
        <img src={APP_LOGO} className="marapp-qa-logo ng-margin" />
      </a>
      <p className="ng-text-weight-bold ng-color-ultraltgray ng-margin-medium-bottom">Oops!</p>
      <p className="ng-margin-medium-bottom">{error}</p>
      <Link
        to={{ type: 'PROFILE' }}
        className="ng-button ng-button-secondary ng-width-1-1 marapp-qa-gotoprofile"
      >
        return to profile
      </Link>
    </div>
  </div>
);
