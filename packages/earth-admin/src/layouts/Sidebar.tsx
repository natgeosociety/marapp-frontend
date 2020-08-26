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
import { Spinner } from '@marapp/earth-components';

import { APP_LOGO, APP_NAME } from '../theme';
import { SidebarSelect, LinkWithOrg, OrgSwitcher } from 'components';
import { IAdminPage } from 'components/sidebar-select/model';

import './styles.scss';

interface IProps {
  isLoading?: boolean;
  children?: React.ReactNode;
  page?: IAdminPage[];
}

const SidebarLayout = (props: IProps) => {
  return (
    <div className="ng-sidebar ng-flex ng-flex-column ng-flex-top ng-shadow-medium">
      <div className="ng-shadow-large ng-background-dkgray">
        <nav className="ng-padding-medium-top ng-sidebar-header">
          <div
            className="ng-padding-medium-horizontal ng-ep-background-dark ng-margin-bottom ng-flex ng-flex-middle ng-position-relative">
            <LinkWithOrg to='/' className="ng-border-remove">
              <img src={APP_LOGO} alt={APP_NAME} className="ng-margin-remove ng-display-block"/>
            </LinkWithOrg>
            <span className="ng-margin-small-horizontal ng-color-white">|</span>
            <OrgSwitcher/>
          </div>
        </nav>
        <SidebarSelect path={props.page}/>
      </div>
      <div className="ng-position-relative ng-padding-horizontal ng-padding-top ng-background-dkgray"/>
      {props.isLoading ? <div className="ng-position-relative ng-margin-large"><Spinner /></div> : props.children}
    </div>
  );
};

export default SidebarLayout;
