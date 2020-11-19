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
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import { animated, Keyframes } from 'react-spring/renderprops.cjs';
import compose from 'lodash/fp/compose';
import noop from 'lodash/noop';

import { useDomWatcher, Elang } from '@marapp/earth-shared';

import './styles.scss';

// TODO Replace this with a propper dropdown component
const Dropdown: any = Keyframes.Spring({
  false: { x: `-100vh` },
  true: { x: '0vh' },
});

interface IProps {
  profileLink: React.ReactElement;
  onLogin?: () => {};
  onLogout?: () => {};
  onSignUp?: () => {};
  isAuthenticated?: boolean;
  selected?: string;
}

export const UserMenu = (props: IProps) => {
  const { t, i18n } = useTranslation();
  const {
    isAuthenticated = false,
    onLogin = noop,
    onLogout = noop,
    onSignUp = noop,
    selected,
    profileLink,
  } = props;
  const [showDrop, setShowDrop] = useState(false);
  const [showLangDrop, setShowLangDrop] = useState(false);

  const profileMenuRef = useDomWatcher(() => setShowDrop(false), !showDrop);
  const langMenuRef = useDomWatcher(() => setShowLangDrop(false), !showLangDrop);

  const toggleDrop = (e) => {
    e.preventDefault();
    setShowDrop(!showDrop);
  };

  const toggleLangDrop = (e) => {
    e.preventDefault();
    setShowLangDrop(!showLangDrop);
  };

  const changeLanguage = (e, lang) => {
    toggleLangDrop(e);
    i18n.changeLanguage(lang);
  };

  const selectedLanguage = i18n.language;

  return (
    <div className="marapp-qa-useraccount ng-user-account">
      <div className="ng-display-inline" ref={langMenuRef}>
        {!!selectedLanguage && (
          <>
            <button
              className="ng-background-ultradkgray ng-color-light ng-padding-medium-horizontal ng-padding-small-vertical ng-margin-medium-right"
              onClick={toggleLangDrop}
            >
              <span className="ng-text-weight-medium ng-text-uppercase">{selectedLanguage}</span>
              <i
                className={classnames('ng-icon ng-color-white ng-margin-left', {
                  'ng-icon-directionup': showLangDrop,
                  'ng-icon-directiondown': !showLangDrop,
                })}
              />
            </button>
            <Dropdown native={true} state={`${showLangDrop}`}>
              {({ x, ...props }) => (
                <animated.div
                  style={{
                    transform: x.interpolate((x) => `translate3d(85px, ${x},0)`),
                    position: 'absolute',
                    ...props,
                  }}
                >
                  <ul className="ng-user-profile-dropdown">
                    <li>
                      <h4 className="ng-text-display-s ng-margin-remove">{t('Languages')}</h4>
                    </li>
                    <li
                      className={classnames({
                        selected: selectedLanguage === Elang.EN,
                      })}
                    >
                      <a className="marapp-qa-lang-en" onClick={(e) => changeLanguage(e, Elang.EN)}>
                        English
                      </a>
                    </li>
                    <li
                      className={classnames({
                        selected: selectedLanguage === Elang.ES,
                      })}
                    >
                      <a className="marapp-qa-lang-es" onClick={(e) => changeLanguage(e, Elang.ES)}>
                        Español
                      </a>
                    </li>
                    <li
                      className={classnames({
                        selected: selectedLanguage === Elang.FR,
                      })}
                    >
                      <a className="marapp-qa-lang-fr" onClick={(e) => changeLanguage(e, Elang.FR)}>
                        Français
                      </a>
                    </li>
                  </ul>
                </animated.div>
              )}
            </Dropdown>
          </>
        )}
      </div>
      <div className="ng-display-inline" ref={profileMenuRef}>
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
                  <h4 className="ng-text-display-s ng-margin-remove ng-text-uppercase">
                    {t('Account')}
                  </h4>
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
                      <a onClick={compose(onLogout, toggleDrop)}>{t('Sign Out')}</a>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="marapp-qa-signin">
                      <a onClick={compose(onLogin, toggleDrop)}>{t('Sign in')}</a>
                    </li>
                    <li className="marapp-qa-signup">
                      <a onClick={compose(onSignUp, toggleDrop)}>{t('Sign up')}</a>
                    </li>
                  </>
                )}
              </ul>
            </animated.div>
          )}
        </Dropdown>
      </div>
    </div>
  );
};
