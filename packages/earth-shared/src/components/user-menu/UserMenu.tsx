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

import React, { useState } from 'react';
import classnames from 'classnames';
import { animated, Keyframes } from 'react-spring/renderprops';
import { compose } from 'lodash/fp';

import { useDomWatcher } from '@marapp/earth-shared';

import './styles.scss';

// TODO Replace this with a propper dropdown component
const Dropdown: any = Keyframes.Spring({
  false: { x: `-100vh` },
  true: { x: '0vh' },
});

interface IProps {
  isAuthenticated: boolean;
  profileLink: React.ReactElement;
  onLogin: () => {};
  onLogout: () => {};
  onSignUp: () => {};
  selected?: string;
}

export const UserMenu = (props: IProps) => {
  const { isAuthenticated = false, onLogin, onLogout, onSignUp, selected, profileLink } = props;
  const [showDrop, setShowDrop] = useState(false);

  const menuRef = useDomWatcher(() => setShowDrop(false), !showDrop);

  const toggleDrop = (e) => {
    e.preventDefault();
    setShowDrop(!showDrop);
  };

  return (
    <div className="marapp-qa-useraccount ng-user-account" ref={menuRef}>
      <button
        className="ng-user-profile ng-background-ultraltgray ng-color-black"
        onClick={toggleDrop}
      >
        <i
          className={classnames({
            'ng-icon-account': isAuthenticated,
            'ng-icon-account-outline': !isAuthenticated,
          })}
        />
      </button>
      <Dropdown native={true} state={`${showDrop}`}>
        {({ x, ...props }) => (
          <animated.div
            style={{
              transform: x.interpolate((x) => `translate3d(0,${x},0)`),
              ...props,
            }}
          >
            <ul className="ng-user-profile-dropdown">
              <li>
                <h4 className="ng-text-display-s ng-margin-remove">ACCOUNT</h4>
              </li>
              {isAuthenticated ? (
                <>
                  <li
                    className={classnames({
                      selected: selected === 'profile',
                    })}
                  >
                    {profileLink}
                  </li>

                  <li>
                    <hr className="ng-margin-remove" />
                  </li>

                  <li className="marapp-qa-signout">
                    <a onClick={compose(onLogout, toggleDrop)}>Sign Out</a>
                  </li>
                </>
              ) : (
                <>
                  <li className="marapp-qa-signin">
                    <a onClick={compose(onLogin, toggleDrop)}>Sign in</a>
                  </li>
                  <li className="marapp-qa-signup">
                    <a onClick={compose(onSignUp, toggleDrop)}>Sign up</a>
                  </li>
                </>
              )}
            </ul>
          </animated.div>
        )}
      </Dropdown>
    </div>
  );
};
