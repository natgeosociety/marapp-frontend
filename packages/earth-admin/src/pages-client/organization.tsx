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

import { Link } from 'gatsby';
import { JSHINT } from 'jshint';
import React, { useEffect } from 'react';

import { isValidGroup, isSuperAdmin, Spinner } from '@marapp/earth-shared';

import { useAuth0 } from '@app/auth/auth0';
import { BASE_URL } from '@app/config';

import './styles.scss';

interface IProps {
  org: string;
  children: any;
}

const Organization = (props: IProps) => {
  const { org, children } = props;
  const { isLoading, groups, setupUserOrg, setIsLoading, userData } = useAuth0();

  // CodeMirror is not working without window.JSHINT
  useEffect(() => {
    // @ts-ignore
    window.JSHINT = JSHINT;
  });

  // Important check for valid ORG and sets it on the context.
  // Happens everytime org changes (runtime/refresh)
  const allowSuperAdminGroup = isSuperAdmin(userData.roles);

  useEffect(() => {
    if (org && (isValidGroup(groups, org), allowSuperAdminGroup)) {
      setupUserOrg(org);
      setIsLoading(false);
    }
  }, [groups, org]);

  if (!org || !isValidGroup(groups, org, allowSuperAdminGroup)) {
    return <OrgSwitcherPage groups={groups} />;
  }

  if (org === '*' && !location.pathname.startsWith(`${BASE_URL}*/organizations`)) {
    window.location.assign(`${BASE_URL}*/organizations`);

    return null;
  }

  if (isLoading) {
    return <Spinner size="medium" />;
  }

  return children;
};

const OrgSwitcherPage = ({ groups }) => (
  <div className="marapp-qa-organizationpage ng-orgswitcher-page">
    <div>
      <h3>Invalid Organization</h3>
      <h6>Please select a valid one:</h6>
      <ul>
        {groups.map((g) => (
          <li>
            <Link to={`/${g}`}>{g}</Link>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default Organization;
