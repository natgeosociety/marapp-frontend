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

import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { makeStyles } from '@material-ui/core/styles';
import { remove } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'redux-first-router-link';

import { AppContextSwitcher, checkAdminRole } from '@marapp/earth-shared';

import { MAP_ADMIN_URL, MAP_APP_NAME, MAP_COMPANY_URL } from '../../config';
import { EPanels } from '../../modules/sidebar/model';
import OrganizationService from '../../services/OrganizationService';
import { APP_LOGO } from '../../theme';
import { Auth0Context } from '../../utils/contexts';

const { Option } = AppContextSwitcher;

const useStyles = makeStyles((theme) => ({
  logo: {
    border: 'none !important',
  },
  organisationListItem: {
    paddingRight: 100,
  },
  organisationSelectionIconContainer: {
    minWidth: theme.spacing(5),
  },
  organisationCheckbox: {
    padding: 0,
  },
}));

interface IProps {
  setPlacesSearch?: Function;
  resetMap?: Function;
  setLayersSearch?: Function;
  setSidebarPanel?: Function;
  resetLayers?: Function;
}

const Header = (props: IProps) => {
  const { t } = useTranslation();
  const {
    roles,
    userData: { allGroups },
    isAuthenticated,
    groups,
    setupUserOrg,
    selectedGroup,
  } = useContext(Auth0Context);
  const { resetMap, setPlacesSearch, setLayersSearch, setSidebarPanel, resetLayers } = props;
  const hasMultipleGroups = allGroups.length > 1;
  const allInitiallySelected = selectedGroup.length === allGroups.length;
  const [selectedGroups, setSelectedGroups] = useState(allInitiallySelected ? [] : selectedGroup);
  const [availableGroups, setAvailableGroups] = useState(
    groups.map((group) => ({ name: group, layers: 'N/A', locations: 'N/A' }))
  );

  const classes = useStyles();

  useEffect(() => {
    (async () => {
      try {
        const response = await OrganizationService.fetchStats({ group: groups.join(',') });
        setAvailableGroups(response.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // Same as the action from <SearchBox /> find a way to reuse bundled actions
  const handleResetLocation = () => {
    setLayersSearch({ search: '' });
    setPlacesSearch({ search: '' });
    setSidebarPanel(EPanels.PLACES);
    resetLayers();
    resetMap();
  };

  const onOrgChange = (org) => {
    const exists = selectedGroups.includes(org);
    let temp = [...selectedGroups];

    let newSelection;
    if (exists) {
      remove(temp, (g) => g === org);
      newSelection = temp;

      if (temp.length <= 0) {
        temp = [...allGroups];
        newSelection = [];
      }
    } else {
      temp.push(org);
      newSelection = temp;
    }

    setSelectedGroups(newSelection);
    setupUserOrg(newSelection);
    setPlacesSearch({
      filters: {},
    });
    setLayersSearch({
      filters: {},
    });
  };

  const logo = (
    <Link
      className={`${classes.logo} marapp-qa-logo`}
      to={{
        type: 'EARTH',
      }}
    >
      <img src={APP_LOGO} alt={MAP_APP_NAME} onClick={handleResetLocation} />
    </Link>
  );

  const adminOrgs = Object.keys(roles).filter((group) => checkAdminRole(roles[group]));

  const superAdminGroup = adminOrgs.find((group) => group === '*');

  const menuGroups: any[] = [...availableGroups];

  if (superAdminGroup) {
    menuGroups.push({
      name: superAdminGroup,
    });
  }

  const orgCheckBoxes = (
    <div>
      <List
        className="marapp-qa-orglist"
        subheader={<ListSubheader>{t('Organizations')}</ListSubheader>}
      >
        {menuGroups.map((g, i) => {
          const isSuperAdmin = g.name === '*';

          const listItemProps = {
            button: true,
            classes: {
              root: classes.organisationListItem,
            },
            dense: true,
            key: i,
            ...(isSuperAdmin
              ? {
                  component: 'a',
                  href: `${MAP_ADMIN_URL}${g.name}`,
                }
              : {
                  onClick: () => onOrgChange(g.name),
                }),
          };

          return (
            <ListItem {...listItemProps}>
              {hasMultipleGroups && (
                <ListItemIcon className={classes.organisationSelectionIconContainer}>
                  {!isSuperAdmin && (
                    <Checkbox
                      checked={!!selectedGroups.find((x) => x === g.name)}
                      classes={{
                        root: classes.organisationCheckbox,
                      }}
                    />
                  )}
                </ListItemIcon>
              )}
              <ListItemText
                primary={g.name}
                secondary={
                  !isSuperAdmin && (
                    <span>
                      {t('Places')} ({g.locations})<strong className="ng-icon-bullet" />
                      {t('Layers')} ({g.layers})
                    </span>
                  )
                }
              />
              <ListItemSecondaryAction>
                <Button
                  component="a"
                  className={`marapp-qa-admin-link marapp-qa-admin-link-${g}`}
                  href={`${MAP_ADMIN_URL}${g.name}`}
                  variant="outlined"
                  size="small"
                >
                  Admin
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
      <Divider />
    </div>
  );

  return (
    <AppContextSwitcher
      logo={logo}
      label={t('Map View')}
      value="map-view"
      checkedCount={selectedGroups.length}
      renderDropdown={isAuthenticated}
      onChange={(g) => window.location.assign(`${MAP_ADMIN_URL}${g}`)}
    >
      {MAP_COMPANY_URL ? (
        <Option
          value="map-view"
          divider={true}
          component="a"
          href={MAP_COMPANY_URL}
          title={MAP_APP_NAME}
        >
          <strong>{t('Home')}</strong>
        </Option>
      ) : null}

      {orgCheckBoxes}

      <Option
        value="map-view"
        divider={true}
        component="a"
        href={`${MAP_COMPANY_URL}/about`}
        title={MAP_APP_NAME}
      >
        <strong>{t('About')}</strong>
      </Option>

      <Option
        value="map-view"
        component="a"
        href={`${MAP_COMPANY_URL}/support`}
        title={MAP_APP_NAME}
      >
        <strong>{t('Support')}</strong>
      </Option>
    </AppContextSwitcher>
  );
};

export default Header;
