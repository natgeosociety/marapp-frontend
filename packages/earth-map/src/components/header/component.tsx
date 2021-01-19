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

import { Auth0Context } from 'auth/auth0';
import classNames from 'classnames';
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

interface IProps {
  group?: string[];
  resetPlace?: Function;
  resetCollection?: Function;
  setPlacesSearch?: Function;
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

  const onOrgChange = (e) => {
    const exists = selectedGroups.includes(e.target.value);
    let temp = [...selectedGroups];

    let newSelection;
    if (exists) {
      remove(temp, (g) => g === e.target.value);
      newSelection = temp;

      if (temp.length <= 0) {
        temp = [...allGroups];
        newSelection = [];
      }
    } else {
      temp.push(e.target.value);
      newSelection = temp;
    }

    setSelectedGroups(newSelection);
    setUserGroup(temp);
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
    <li className="marapp-qa-orglist ng-form ng-form-dark">
      <div className="ng-padding-medium-horizontal ng-padding-top">
        {availableGroups.map((g, i) => (
          <label
            htmlFor={g.name}
            className={classNames('ng-padding-bottom ng-flex', {
              'ng-c-cursor-pointer': hasMultipleGroups,
            })}
            key={i}
          >
            {hasMultipleGroups && (
              <input
                className="ng-checkbox-input ng-flex-item-none ng-margin-top-remove"
                type="checkbox"
                id={g.name}
                value={g.name}
                checked={!!selectedGroups.find((x) => x === g.name)}
                name={g.name}
                onChange={(e) => onOrgChange(e)}
              />
            )}
            <div>
              {g.name}
              <span className="ng-display-block ng-color-mdgray">
                {t('Places')} ({g.locations})<strong className="ng-icon-bullet" />
                {t('Layers')} ({g.layers})
              </span>
            </div>
          </label>
        ))}
      </div>
    </li>
  );

  return (
    <AppContextSwitcher
      logo={logo}
      label={t('Map View')}
      value="map-view"
      checkedCount={selectedGroups.length}
      renderDropdown={isAuthenticated}
      onChange={(g) => window.location.assign(`${ADMIN_URL}${g}`)}
    >
      <Option value="map-view">{t('Map View')}</Option>
      {orgCheckBoxes}
      {Object.keys(roles).map(
        (g) =>
          checkAdminRole(roles[g]) && (
            <Option value={g} key={g}>
              {g} - ADMIN
            </Option>
          )
      )}
    </AppContextSwitcher>
  );
};

export default Header;
