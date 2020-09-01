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
import { useDomWatcher } from 'utils/hooks';
import { Keyframes, animated } from 'react-spring/renderprops';

import './styles.scss';

const Dropdown: any = Keyframes.Spring({
  false: { x: `-100vh` },
  true: { x: '0vh' },
});

export default function UserMenuComponent() {
  const [showDrop, setShowDrop] = useState(false);

  const { userData, logout } = useContext(Auth0Context);

  const menuRef = React.useRef(null);

  const handleClickOutside = () => {
    setShowDrop(false);
  };

  useDomWatcher(menuRef, handleClickOutside, !showDrop);

  const toggleDrop = ( e ) => {
    e.preventDefault();
    setShowDrop(!showDrop);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="marapp-qa-useraccount ng-user-account" ref={menuRef}>
      <button className="ng-unstyled" onClick={( e ) => toggleDrop(e)}>
        {userData.picture && (
          <img className="ng-user-profile" src={userData.picture} alt={userData.name}/>
        )}
        {!userData.picture && <i className="ng-icon ng-icon-user"/>}
      </button>
      <Dropdown native state={`${showDrop}`}>
        {( { x, ...props } ) => (
          <animated.div
            style={{
              transform: x.interpolate(( x ) => `translate3d(0,${x},0)`),
              ...props,
            }}
          >
            <ul className="ng-user-profile-dropdown">
              <li>ACCOUNT</li>
              <li className="ng-user-profile-signout">
                <a className="marapp-qa-actionsignout" onClick={handleLogout}>Sign Out</a>
              </li>
            </ul>
          </animated.div>
        )}
      </Dropdown>
    </div>
  );
}
