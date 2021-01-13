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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import { Auth0Context } from 'auth/auth0';
import { ADMIN_URL, APP_NAME } from 'config';
import { remove } from 'lodash';
import { EPanels } from 'modules/sidebar/model';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'redux-first-router-link';
import OrganizationService from 'services/OrganizationService';
import { APP_LOGO } from 'theme';

import { AppContextSwitcher, checkAdminRole } from '@marapp/earth-shared';

const { Option } = AppContextSwitcher;

const useStyles = makeStyles((theme) => ({
  organisationSelectionIconContainer: {
    minWidth: theme.spacing(5),
  },
  organisationCheckbox: {
    padding: 0,
  },
}));

interface IProps {
  group?: string[];
  resetPlace?: Function;
  resetCollection?: Function;
  setPlacesSearch?: Function;
  resetPlacesFeatured?: Function;
  resetMap?: Function;
  resetLayerCache?: Function;
  setUserGroup?: Function;
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
  } = useContext(Auth0Context);
  const {
    group,
    resetPlacesFeatured,
    resetLayerCache,
    resetMap,
    resetPlace,
    resetCollection,
    setUserGroup,
    setPlacesSearch,
    setLayersSearch,
    setSidebarPanel,
    resetLayers,
  } = props;
  const hasMultipleGroups = allGroups.length > 1;
  const allInitiallySelected = group.length === allGroups.length;
  const [selectedGroups, setSelectedGroups] = useState(allInitiallySelected ? [] : group);
  const [dropdownState, setDropdownState] = useState('close');
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

  const handleDropdownToggle = () => {
    dropdownState === 'close' ? setDropdownState('open') : setDropdownState('close');
  };

  // Same as the action from <SearchBox /> find a way to reuse bundled actions
  const handleResetLocation = () => {
    resetPlace({ keepCache: true });
    resetCollection();
    setPlacesSearch({ search: '' });
    setLayersSearch({ search: '' });
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
    setUserGroup(temp);
    resetPlacesFeatured();
    resetLayerCache();
    setPlacesSearch({
      filters: {},
    });
    setLayersSearch({
      filters: {},
    });
  };

  const logo = (
    <Link
      className="ng-border-remove"
      to={{
        type: 'EARTH',
      }}
    >
      <img
        src={APP_LOGO}
        alt={APP_NAME}
        className="ng-margin-remove ng-display-block"
        onClick={handleResetLocation}
      />
    </Link>
  );

  const orgCheckBoxes = (
    <div>
      <List component="div" className="marapp-qa-orglist">
        {availableGroups.map((g, i) => (
          <ListItem key={i} dense={true} button={true} onClick={() => onOrgChange(g.name)}>
            {hasMultipleGroups && (
              <ListItemIcon className={classes.organisationSelectionIconContainer}>
                <Checkbox
                  checked={!!selectedGroups.find((x) => x === g.name)}
                  classes={{
                    root: classes.organisationCheckbox,
                  }}
                />
              </ListItemIcon>
            )}
            <ListItemText
              primary={g.name}
              secondary={
                <span>
                  {t('Places')} ({g.locations})<strong className="ng-icon-bullet" />
                  {t('Layers')} ({g.layers})
                </span>
              }
            />
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  );

  const adminOrgs = Object.keys(roles).filter((group) => checkAdminRole(roles[group]));

  return (
    <AppContextSwitcher
      logo={logo}
      label={t('Map View')}
      value="map-view"
      checkedCount={selectedGroups.length}
      renderDropdown={isAuthenticated}
      onChange={(g) => window.location.assign(`${ADMIN_URL}${g}`)}
    >
      <Option value="map-view" divider={true} disabled={true}>
        {t('Map View')}
      </Option>
      {orgCheckBoxes}
      {adminOrgs.map((group, index) => (
        <Option value={group} key={group} divider={index < adminOrgs.length - 1}>
          {group} - ADMIN
        </Option>
      ))}
    </AppContextSwitcher>
  );
};

export default Header;
