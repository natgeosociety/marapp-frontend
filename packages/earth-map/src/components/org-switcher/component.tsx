import React, { useContext, useState } from 'react';
import { Auth0Context } from 'auth/auth0';

import { checkRole } from 'utils';
import DropdownComponent from 'components/dropdown';
import './styles.scss';
import { remove } from 'lodash';
import classNames from 'classnames';

const ADMIN_PATH = process.env.REACT_APP_ADMIN_URL;

const OrgSwitcher = (props) => {
  const {
    roles,
    userData: { allGroups },
  } = useContext(Auth0Context);
  const { resetPlacesFeatured, resetLayerCache } = props;
  const { group, setUserGroup, setPlacesSearch } = props;
  const hasMultipleGroups = allGroups.length > 1;
  const allInitiallySelected = group.length === allGroups.length;
  const [selectedGroups, setSelectedGroups] = useState(allInitiallySelected ? [] : group);
  const [dropdownState, setDropdownState] = useState('close');

  const handleDropdownToggle = () => {
    dropdownState === 'close' ? setDropdownState('open') : setDropdownState('close');
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
  };

  return (
    <>
      <span className="ng-text-display-s ng-text-weight-regular ng-body-color ng-margin-remove ng-display-block ng-org-name">
        map view
      </span>

      <div
        onClick={handleDropdownToggle}
        className="ng-padding ng-c-cursor-pointer ng-position-relative"
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
        <li className="ng-form ng-form-dark">
          <div className="ng-padding-medium-horizontal ng-padding-top">
            {Object.keys(roles).map((g, i) => (
              <label
                htmlFor={g}
                className={classNames({
                  'ng-display-block ng-padding-bottom': true,
                  'ng-c-cursor-pointer': hasMultipleGroups,
                })}
                key={i}
              >
                {hasMultipleGroups && (
                  <input
                    className="ng-checkbox-input"
                    type="checkbox"
                    id={g}
                    value={g}
                    checked={!!selectedGroups.find((x) => x === g)}
                    name={g}
                    onChange={(e) => onOrgChange(e)}
                  />
                )}
                {g}
              </label>
            ))}
          </div>
        </li>

        {Object.keys(roles).map(
          (g, i) =>
            checkRole(roles[g]) && (
              <li className="ng-ep-dropdown-category" key={i}>
                <a href={`${ADMIN_PATH}${g}`} className="ng-c-cursor-pointer ng-dropdown-item">
                  {g} - ADMIN
                </a>
              </li>
            )
        )}
      </DropdownComponent>
    </>
  );
};

export default OrgSwitcher;
