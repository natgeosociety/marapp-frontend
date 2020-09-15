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
import Helmet from 'react-helmet';
import { LinkWithOrg } from 'components/link-with-org';
import { UserMenuComponent } from 'components/user-menu';
import { ErrorMessages } from 'components/error-messages';
import { Spinner } from '@marapp/earth-components';

import { APP_NAME, APP_LOGO } from '../theme';

import '../styles/app.scss';

interface ILayoutProps {
  children?: any;
  permission?: boolean;
  errors?: Object[];
  backTo?: string;
  isLoading?: boolean;
  className?: string;
}

interface IUnauthorizedProps {
  message: string;
}

const Unauthorized = (props: IUnauthorizedProps) => {
  const {message} = props;

  return (
    <div className="ng-flex ng-flex-middle">
      <div className="ng-margin-medium-left">
        <h3 className="ng-text-edit-m">{message}</h3>
      </div>
    </div>
  );
};

export default function ContentLayout(props: ILayoutProps) {
  return (
    <div className={`ng-flex ${props.className || ''}`}>
      <Helmet>
        <link rel="icon"
              href="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="/>
        <title>{APP_NAME}</title>
      </Helmet>
      <div className="ng-page-container ng-background-gray-9">
        <UserMenuComponent/>
        <div className="ng-padding-large">
          <Content {...props}/>
        </div>
      </div>
    </div>
  );
}

export function UserProfileLayout(props: ILayoutProps) {
  return (
    <div className={`ng-flex ${props.className || ''}`}>
      <Helmet>
        <link rel="icon"
              href="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="/>
        <title>{APP_NAME}</title>
      </Helmet>
      <div className="ng-user-profile-container ng-background-gray-9">
        <div className="ng-margin-top ng-margin-left">
          <a href="/earth" className="ng-border-remove">
            <img src={APP_LOGO} alt={APP_NAME} className="ng-margin-remove ng-display-block"/>
          </a>
        </div>
        <UserMenuComponent/>
        <div className="ng-padding-large">
          <Content {...props}/>
        </div>
      </div>
    </div>
  );
}

const Content = (props: ILayoutProps) => {
  const {
    permission = true, // backwards compatibility, permission moves to errors array
    errors = [],
    backTo = '/',
    isLoading,
  } = props;

  if (isLoading) {
    return <Spinner size="medium"/>;
  }
  if (!permission) {
    return <Unauthorized message="You are not authorized to view this page"/>;
  }
  if (errors.length) {
    return (
      <div>
        <ErrorMessages errors={errors}/>
        <LinkWithOrg className="ng-button" to={backTo}>
          Back
        </LinkWithOrg>
      </div>
    );
  }

  return <div className="ng-margin-medium-top">{props.children}</div>;
};
