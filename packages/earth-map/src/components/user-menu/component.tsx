import React, { useContext, useState, useEffect } from 'react';

import './styles.scss';

import { Auth0Context } from 'auth/auth0';
import {Keyframes, animated} from 'react-spring/renderprops';
import useDomWatcher from 'utils/hooks';

const Dropdown: any =  Keyframes.Spring({
  false: { x: `-100vh`},
  true: { x: '0vh'},
});

export default function UserMenuComponent() {
  const [showDrop, setShowDrop] = useState(false);

  const { userData, logout } = useContext(Auth0Context);

  const menuRef = React.useRef(null);

  const handleClickOutside = () => {
    setShowDrop(false);
  };

  useDomWatcher(menuRef, handleClickOutside, !showDrop);

  const toggleDrop = (e) => {
    e.preventDefault();
    setShowDrop(!showDrop);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="ng-user-account" ref={menuRef}>
      <button className="ng-unstyled" onClick={(e) => toggleDrop(e)}>
        {userData.picture && (
          <img className="ng-user-profile" src={userData.picture} alt={userData.name} />
        )}
        {!userData.picture && <i className="ng-icon ng-icon-user" />}
      </button>
      <Dropdown native state={`${showDrop}`}>
        {({ x, ...props }) => (
          <animated.div
            style={{
              transform: x.interpolate((x) => `translate3d(0,${x},0)`),
              ...props,
            }}
          >
            <ul className="ng-user-profile-dropdown">
              <li>ACCOUNT</li>
              <li className="ng-user-profile-signout">
                <a onClick={handleLogout}>Sign Out</a>
              </li>
            </ul>
          </animated.div>
        )}
      </Dropdown>
    </div>
  );
}
