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
import React, { useState } from 'react';
import Link from 'redux-first-router-link';
import ProfileService from 'services/ProfileService';

import { Spinner } from '@marapp/earth-shared/src';

import './styles.scss';

export const APP_LOGO = require('images/unbl_logo.svg');

enum EmailStates {
  INACTIVE = 'Inactive',
  PENDING = 'Pending',
  DONE = 'Done',
  ERROR = 'Error',
}

interface VerifyEmailState {
  type: EmailStates;
  text: string;
  message?: string;
}

const VerifyEmail = () => {
  const { logout, isEmailVerified } = useAuth0();

  return (
    <div className="verified-page marapp-qa-verify-email">
      <div className="verified-container">
        {isEmailVerified ? <VerifiedEmailTemplate /> : <VerifyEmailTemplate logout={logout} />}
      </div>
    </div>
  );
};

const VerifyEmailTemplate = ({ logout }) => {
  const [emailState, setEmailState] = useState<VerifyEmailState>({
    type: EmailStates.INACTIVE,
    text: 'Send email verification Link',
  });

  const handleResendEmail = async () => {
    setEmailState({ type: EmailStates.PENDING, text: 'sending email validation' });

    try {
      await ProfileService.resendEmailConfirmation();
      setEmailState({ type: EmailStates.DONE, text: 'email sent' });
    } catch (error) {
      setEmailState({
        type: EmailStates.ERROR,
        text: 'something went wrong',
        message: error.data.errors[0].detail,
      });
    }
  };

  return (
    <>
      <p className="ng-text-weight-bold ng-color-ultraltgray ng-margin-medium-bottom">
        Verify Your Email
      </p>
      <p className="ng-margin-medium-bottom">
        Please follow the instructions in the message sent to your email account to complete the
        sign up process. You will be able to see content when an owner assigns you to an
        organization.
      </p>
      {ENABLE_PUBLIC_ACCESS && (
        <>
          <p className="ng-margin-medium-bottom">
            Until then you can still browse content as a public user, or you may visit our{' '}
            <a href="https://github.com/natgeosociety/marapp-frontend/blob/master/ABOUT.md">
              about page.
            </a>
          </p>
        </>
      )}
      <button
        className="marapp-qa-logout ng-button ng-button-primary ng-width-1-1 ng-margin-bottom"
        onClick={(e) => logout()}
      >
        View {APP_NAME} as a Public User
      </button>
      <button
        disabled={emailState.type.includes(EmailStates.DONE)}
        className="ng-button ng-button-secondary ng-width-1-1 marapp-qa-resendemail"
        onClick={(e) => handleResendEmail()}
      >
        {emailState.type.includes(EmailStates.PENDING) && (
          <Spinner size="nano" position="relative" className="ng-display-inline" />
        )}
        {emailState.text}
      </button>
      {emailState.message && <span className="ng-form-error-block">{emailState.message}</span>}
    </>
  );
};

const VerifiedEmailTemplate = () => {
  return (
    <>
      <p className="ng-text-weight-bold ng-color-ultraltgray ng-margin-medium-bottom">
        Email verified!
      </p>
      <p className="ng-margin-medium-bottom">
        Your email address has been successfully verified. To access your account, please sign in
        with your new email.
      </p>
      <Link
        to={{ type: 'EARTH' }}
        className="ng-button ng-button-primary ng-width-1-1 ng-margin-bottom marapp-qa-returnhome"
      >
        Return to home
      </Link>
    </>
  );
};

export default VerifyEmail;
