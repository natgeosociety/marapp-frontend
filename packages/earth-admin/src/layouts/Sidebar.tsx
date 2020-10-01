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
import { navigate } from 'gatsby';

import { Spinner, AppContextSwitcher } from '@marapp/earth-shared';

import { LinkWithOrg } from '@app/components/link-with-org';
import { SidebarSelect } from '@app/components/sidebar-select';
import { IAdminPage } from '@app/components/sidebar-select/model';
import { Auth0Context } from '@app/utils/contexts';

import { APP_LOGO, APP_NAME } from '../theme';
import './styles.scss';

const { Option } = AppContextSwitcher;

interface IProps {
  isLoading?: boolean;
  children?: React.ReactNode;
  page?: IAdminPage[];
}

const SidebarLayout = (props: IProps) => {
  const { groups, selectedGroup } = useContext(Auth0Context);

  const logo = (
    <LinkWithOrg to="/" className="ng-border-remove">
      <img src={APP_LOGO} alt={APP_NAME} className="ng-margin-remove ng-display-block" />
    </LinkWithOrg>
  );

  return (
    <div className="ng-sidebar ng-flex ng-flex-column ng-flex-top ng-shadow-medium">
      <div className="ng-sidebar-header ng-shadow-large ng-background-dkgray ng-padding-bottom">
        <AppContextSwitcher
          logo={logo}
          label="Map View"
          defaultValue={selectedGroup}
          onChange={(g) => {
            if (g === 'map-view') {
              window.location.assign('/');
            } else {
              navigate(`/${g}`);
            }
          }}
        >
          <Option value="map-view">Map View</Option>
          {!!groups &&
            groups.map((g) => (
              <Option value={g} key={g}>
                {g}
              </Option>
            ))}
        </AppContextSwitcher>
        <SidebarSelect path={props.page} />
      </div>
      {props.isLoading ? (
        <div className="ng-position-relative ng-margin-large">
          <Spinner />
        </div>
      ) : (
        props.children
      )}
    </div>
  );
};

export default SidebarLayout;
