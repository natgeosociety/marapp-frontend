import React, { useContext, useState, useEffect } from 'react';

import './styles.scss';

import { Auth0Context } from 'auth/auth0';
import { animated, Keyframes } from 'react-spring';
import useDomWatcher from 'utils/hooks';

const Dropdown: any = Keyframes.Spring({
  false: { x: 0, delay: 0 },
  true: { x: 1, from: { x: 0 }, delay: 100 },
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
              opacity: x,
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
