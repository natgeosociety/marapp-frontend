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

import React, { useContext } from 'react';
import Helmet from 'react-helmet';

import { favicon, Spinner, UserMenu } from '@marapp/earth-shared';

import { Card } from '@marapp/earth-shared';
import { LinkWithOrg } from '@app/components/link-with-org';
import { MAP_PATH } from '@app/config';
import { Auth0Context } from '@app/utils/contexts';

import '../styles/app.scss';
import { APP_NAME } from '../theme';

interface ILayoutProps {
  children?: any;
  permission?: boolean;
  errors?: Object[];
  backTo?: string;
  isLoading?: boolean;
  className?: string;
  errorPage?: string;
}

interface IUnauthorizedProps {
  message: string;
}

const Unauthorized = (props: IUnauthorizedProps) => {
  const { message } = props;

  return (
    <div className="ng-flex ng-flex-middle">
      <div className="ng-margin-medium-left">
        <h3 className="ng-text-edit-m">{message}</h3>
      </div>
    </div>
  );
};

export default function ContentLayout(props: ILayoutProps) {
  const { logout, login, isAuthenticated } = useContext(Auth0Context);

  return (
    <div className={`ng-flex ${props.className || ''}`}>
      <Helmet>
        <link rel="icon" href={favicon} />
        <title>{APP_NAME}</title>
      </Helmet>
      <div className="ng-page-container ng-background-gray-9">
        <UserMenu
          isAuthenticated={isAuthenticated}
          profileLink={<a href={`${MAP_PATH}profile`}>Profile</a>}
          onLogin={login}
          onLogout={logout}
          onSignUp={() => login({ initialScreen: 'signUp' })}
        />
        <div className="ng-padding-large">
          <Content {...props} />
        </div>
      </div>
    </div>
  );
}

const NotFound = (props: ILayoutProps) => {
  const { backTo = '/', errorPage } = props;

  return (
    <div className="marapp-qa-recorderror">
      <h1 className="ng-text-display-m ng-margin-medium-bottom ng-form-error-block">OOPS!</h1>
      <div className="ng-grid">
        <div className="ng-width-1-2">
          <Card>
            <p>
              The {errorPage} you are looking for could not be retrieved or doesn't exist. Return to{' '}
              {errorPage}s home, search for {errorPage}s, or create a new {errorPage}.
            </p>
            <div className="ng-flex ng-flex-center">
              <LinkWithOrg
                className="ng-button ng-button-secondary marapp-qa-actionreturn"
                to={backTo}
              >
                Return to {errorPage}s home
              </LinkWithOrg>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Content = (props: ILayoutProps) => {
  const {
    permission = true, // backwards compatibility, permission moves to errors array
    errors = [],
    isLoading,
  } = props;

  if (isLoading) {
    return <Spinner size="medium" />;
  }
  if (!permission) {
    return <Unauthorized message="You are not authorized to view this page" />;
  }

  if (errors.length) {
    return <NotFound {...props} />;
  }

  return <div className="ng-margin-medium-top">{props.children}</div>;
};
