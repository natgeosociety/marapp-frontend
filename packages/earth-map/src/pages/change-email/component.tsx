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
import React, { useEffect } from 'react';
import ProfileService from 'services/ProfileService';

import { Spinner } from '@marapp/earth-shared';
import { replace } from 'redux-first-router';

enum ChangeEmailStates {
  VERIFIED = 'Email Change Successful. Please sign in with your new email to continue with your update.',
  ERROR = 'Email Update Error',
  PENDING = 'Change Email. Please sign in with your original account email to continue with your update.',
}

export default function ChangeEmailComponent() {
  const { login, isAuthenticated } = useAuth0();

  useEffect(() => {
    const fn = async () => {
      const hashParameter = window.location.hash;
      const hashQuery = hashParameter.split('#')[1];
      const params = new URLSearchParams(hashQuery);

      const accessToken = params.get('access_token');
      const error = params.get('error');
      const error_description = params.get('error_description');

      if (!isAuthenticated) {
        console.log(accessToken);
        localStorage.setItem('emailToken', accessToken);
        return login({
          appState: { targetUrl: '/profile/change-email' },
          emailState: ChangeEmailStates['PENDING'],
        });
      } else {
        try {
          const emailToken = localStorage.getItem('emailToken');
          if (emailToken) {
            try {
              const response = await ProfileService.changeEmailConfirmation({
                accessToken: emailToken,
              });
              if (response && response?.data?.success) {
                // Auth0 sessions are reset when a user’s email or password changes;
                // force a re-login if email change request successful;
                return login({
                  appState: { targetUrl: '/profile/change-email' },
                  emailState: ChangeEmailStates['VERIFIED'],
                });
              } else {
                return login({
                  appState: { targetUrl: '/profile/change-email' },
                  emailState: ChangeEmailStates['ERROR'],
                });
              }
            } catch (e) {
              console.log('error', e);
              console.log(error, error_description);
              return login({ appState: { targetUrl: '/profile/change-email' }, emailState: e });
            }
          }
        } finally {
          localStorage.removeItem('emailToken');
          replace('/profile');
        }
      }
    };
    fn();
  });

  return <Spinner size="large" />;
}
