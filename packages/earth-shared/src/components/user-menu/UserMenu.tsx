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

import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import { usePopupState, bindTrigger, bindMenu } from 'material-ui-popup-state/hooks';
import ToggleIcon from 'material-ui-toggle-icon';
import IconAccount from 'mdi-material-ui/Account';
import IconAccountOutline from 'mdi-material-ui/AccountOutline';
import IconUp from 'mdi-material-ui/ChevronUp';
import IconDown from 'mdi-material-ui/ChevronDown';

import React from 'react';
import { useTranslation } from 'react-i18next';
import compose from 'lodash/fp/compose';
import noop from 'lodash/noop';
import { getInitials } from '../../utils';

import { Elang, TranslationService } from '@marapp/earth-shared';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    display: 'flex',
    alignItems: 'center',
    right: theme.spacing(2),
    top: theme.spacing(1),
    zIndex: 10000,
  },
  authButton: {
    height: theme.spacing(4),
    minHeight: theme.spacing(4),
    width: theme.spacing(4),
  },
  menu: {
    minWidth: theme.spacing(15),
    '& a': {
      borderBottom: 0,
    },
  },
  languageButton: {
    backgroundColor: theme.palette.grey['600'],
    color: theme.palette.text.primary,
    marginRight: theme.spacing(1),
    '&:hover': {
      backgroundColor: theme.palette.background.default,
    },
  },
}));

interface IProps {
  profileLink: React.ReactElement;
  userName?: string;
  onLogin?: () => {};
  onLogout?: () => {};
  onSignUp?: () => {};
  isAuthenticated?: boolean;
  selected?: string;
}

export const UserMenu = (props: IProps) => {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const {
    isAuthenticated = false,
    onLogin = noop,
    onLogout = noop,
    onSignUp = noop,
    selected,
    profileLink,
    userName,
  } = props;

  const popupState = usePopupState({ variant: 'popover', popupId: 'userMenu' });
  const popupStateLang = usePopupState({ variant: 'popover', popupId: 'languageMenu' });

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    popupStateLang.close();
  };

  const handleLogout = () => {
    const defaultLanguage = TranslationService.getDefaultLanguage();
    i18n.changeLanguage(defaultLanguage);
    popupState.close();
  };

  const selectedLanguage = i18n.language;

  return (
    <div className={`marapp-qa-useraccount ${classes.root}`}>
      <div className="ng-display-inline">
        {!!selectedLanguage && (
          <>
            <Button
              className={classes.languageButton}
              {...bindTrigger(popupStateLang)}
              size="small"
              variant="contained"
              endIcon={
                <ToggleIcon on={popupStateLang.isOpen} onIcon={<IconUp />} offIcon={<IconDown />} />
              }
            >
              {selectedLanguage}
            </Button>
            <Menu
              {...bindMenu(popupStateLang)}
              classes={{ paper: classes.menu }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              marginThreshold={42} // hack to push the menu below the trigger button
              getContentAnchorEl={null}
            >
              {[
                { name: 'English', value: Elang.EN },
                { name: 'Español', value: Elang.ES },
                { name: 'Français', value: Elang.FR },
                { name: 'Pусский', value: Elang.RU },
              ].map(({ name, value }) => (
                <MenuItem
                  key={name}
                  selected={selectedLanguage === value}
                  onClick={() => {
                    changeLanguage(value);
                  }}
                >
                  {name}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
      </div>
      <div>
        <Fab
          className={classes.authButton}
          {...bindTrigger(popupState)}
          size="small"
          color="primary"
        >
          {userName ? (
            getInitials(userName)
          ) : isAuthenticated ? (
            <IconAccount />
          ) : (
            <IconAccountOutline />
          )}
        </Fab>

        <Menu
          {...bindMenu(popupState)}
          classes={{ paper: classes.menu }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          marginThreshold={42} // hack to push the menu below the trigger button
          getContentAnchorEl={null}
        >
          <MenuItem disabled={true}>{t('Account')}:</MenuItem>

          {isAuthenticated
            ? [
                <MenuItem key="profile" selected={selected === 'profile'} divider={true}>
                  {profileLink}
                </MenuItem>,
                <MenuItem
                  key="sign-out"
                  className="marapp-qa-signout"
                  onClick={compose(handleLogout, onLogout, () => popupState.close())}
                >
                  {t('Sign Out')}
                </MenuItem>,
              ]
            : [
                <MenuItem
                  key="sign-in"
                  className="marapp-qa-signin"
                  onClick={compose(onLogin, () => popupState.close())}
                  divider={true}
                >
                  {t('Sign in')}
                </MenuItem>,
                <MenuItem
                  key="sign-out"
                  className="marapp-qa-signup"
                  onClick={compose(onSignUp, () => popupState.close())}
                >
                  {t('Sign up')}
                </MenuItem>,
              ]}
        </Menu>
      </div>
    </div>
  );
};
