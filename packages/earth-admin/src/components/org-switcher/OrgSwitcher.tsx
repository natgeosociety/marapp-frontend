import React, { useContext, useState } from 'react';
import { Auth0Context } from 'utils/contexts';
import classnames from 'classnames';

import DropdownComponent from 'components/dropdown';
import { Tooltip } from '@marapp/earth-components';
import { LinkWithOrg } from 'components/LinkWithOrg';

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
