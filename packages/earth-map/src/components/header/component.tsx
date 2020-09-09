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

import React, { useContext, useState, useEffect } from 'react';
import { remove } from 'lodash';
import classNames from 'classnames';
import Link from 'redux-first-router-link';

import { Auth0Context } from 'auth/auth0';
import DropdownComponent from 'components/dropdown';
import { EPanels } from 'modules/sidebar/model';
import { checkRole, getAvailableOrgs } from 'utils';
import { APP_LOGO } from '../../theme';
import { ADMIN_URL, APP_NAME } from 'config';
import { fetchStats } from 'services/stats';

import './styles.scss';

interface IProps {
  group?: string[];
  resetPlace?: Function;
  setPlacesSearch?: Function;
  resetPlacesFeatured?: Function
  setIndexesSelected?: Function;
  resetMap?: Function;
  resetLayerCache?: Function;
  setUserGroup?: Function;
  setLayersSearch?: Function;
  setSidebarPanel?: Function;
  resetLayers?: Function;
}

const Header = (props: IProps) => {
  const {
    roles,
    userData: { allGroups },
    isAuthenticated
  } = useContext(Auth0Context);
  const {
    group,
    resetPlacesFeatured,
    resetLayerCache,
    resetMap,
    resetPlace,
    setIndexesSelected,
    setUserGroup,
    setPlacesSearch,
    setLayersSearch,
    setSidebarPanel,
    resetLayers
  } = props;
  const hasMultipleGroups = allGroups.length > 1;
  const allInitiallySelected = group.length === allGroups.length;
  const [selectedGroups, setSelectedGroups] = useState(allInitiallySelected ? [] : group);
  const [dropdownState, setDropdownState] = useState('close');
  const [availableOrgs, setAvailableOrgs] = useState(getAvailableOrgs(roles).map(role => ({ name: role, layers: 'N/A', locations: 'N/A' })));

  useEffect(() => {
    
    (async () => {
      try {
        const response: any = await fetchStats({ group: getAvailableOrgs(roles).join(',') });
        setAvailableOrgs(response.data);
      }
      catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const handleDropdownToggle = () => {
    dropdownState === 'close' ? setDropdownState('open') : setDropdownState('close');
  };

  // Same as the action from <SearchBox /> find a way to reuse bundled actions
  const handleResetLocation = () => {
    resetPlace();
    setPlacesSearch({ search: '' });
    setLayersSearch({ search: '' });
    setSidebarPanel(EPanels.PLACES);
    setIndexesSelected('');
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
    resetPlacesFeatured();
    resetLayerCache();
    setPlacesSearch({
      filters: {},
    });
    setLayersSearch({
      filters: {},
    });
  };

  return (

    <div className="marapp-qa-header ng-padding-medium-horizontal ng-ep-background-dark ng-flex ng-flex-middle ng-position-relative ng-padding-bottom ng-padding-small-top">
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
      {isAuthenticated && <>
      <span className="ng-ep-kicker"></span>

      <span className="ng-text-display-s ng-text-weight-regular ng-body-color ng-margin-remove ng-display-block ng-org-name">
        map view
      </span>

      <div
        onClick={handleDropdownToggle}
        className="marapp-qa-orgtogglebutton ng-padding ng-c-cursor-pointer ng-position-relative"
      >
        <i
          className={classNames({
            'ng-body-color': true,
            'ng-icon-directionup': dropdownState === 'open',
            'ng-icon-directiondown': dropdownState !== 'open',
          })}
        />
        {selectedGroups.length > 0 && <span className="ng-org-badge">{selectedGroups.length}</span>}
      </div>

      <DropdownComponent state={dropdownState}>
        <li className="ng-ep-dropdown-category ng-ep-dropdown-selected">
          <span className="ng-dropdown-item">MAP VIEW</span>
        </li>
        <li className="marapp-qa-orglist ng-form ng-form-dark">
          <div className="ng-padding-medium-horizontal ng-padding-top">
            {availableOrgs.map((g, i) => (
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
                    Places ({g.locations})
                    <strong className="ng-icon-bullet"></strong>
                    Layers ({g.layers})
                  </span>
                </div>
              </label>
            ))}
          </div>
        </li>

        {Object.keys(roles).map(
          (g, i) =>
            checkRole(roles[g]) && (
              <li className="marapp-qa-adminlink ng-ep-dropdown-category" key={i}>
                <a href={`${ADMIN_URL}${g}`} className="ng-c-cursor-pointer ng-dropdown-item">
                  {g} - ADMIN
                </a>
              </li>
            )
        )}
      </DropdownComponent>
      </> }
    </div>
  );
};

export default Header;
