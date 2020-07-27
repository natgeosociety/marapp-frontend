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

import React, { useContext, useState } from 'react';
import { Auth0Context } from 'utils/contexts';
import classnames from 'classnames';

import DropdownComponent from 'components/dropdown';
import { Tooltip } from '@marapp/earth-components';
import { LinkWithOrg } from 'components/link-with-org';

import { MAP_PATH } from 'config';
import './styles.scss';

const OrgSwitcher = (props) => {
  const { permissions, selectedGroup, setupUserOrg } = useContext(Auth0Context);

  const [dropdownState, setDropdownState] = useState('close');

  const handleOrgSwitch = (group) => {
    setDropdownState('close');
    setupUserOrg(group);
  };

  const handleDropdownToggle = () => {
    dropdownState === 'close' ? setDropdownState('open') : setDropdownState('close');
  };

  return (
    <>
      <span className="ng-text-display-s ng-text-weight-regular ng-color-white ng-margin-remove ng-display-block ng-org-name">
        admin
      </span>
      <div onClick={handleDropdownToggle} className="ng-padding ng-c-cursor-pointer">
        <i
          className={classnames({
            'ng-icon  ng-color-white': true,
            'ng-icon-directionup': dropdownState === 'open',
            'ng-icon-directiondown': dropdownState !== 'open',
          })}
        ></i>
      </div>

      <DropdownComponent state={dropdownState}>
        <li className="ng-ep-dropdown-category">
          <a href={MAP_PATH} className="ng-c-cursor-pointer ng-dropdown-item">
            MAP VIEW
          </a>
        </li>
        {!!permissions &&
          Object.keys(permissions).map((g, i) => (
            <React.Fragment key={i}>
              <li
                className={classnames({
                  'ng-ep-dropdown-category': true,
                  'ng-ep-dropdown-selected': selectedGroup === g,
                })}
              >
                <LinkWithOrg to="/" switchOrgTo={g} className="ng-display-block ng-border-remove">
                  <span
                    className="ng-text-display-s ng-display-block ng-dropdown-item"
                    onClick={(e) => handleOrgSwitch(g)}
                  >
                    {g}
                  </span>
                </LinkWithOrg>
              </li>
            </React.Fragment>
          ))}
      </DropdownComponent>
    </>
  );
};

export default OrgSwitcher;
