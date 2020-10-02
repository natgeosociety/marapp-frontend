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

import React, { useState, Children, cloneElement } from 'react';
import classnames from 'classnames';
import { noop } from 'lodash';

import { useDomWatcher } from '@marapp/earth-shared';

import './styles.scss';

import { Option } from './Option';

interface IProps {
  label: string;
  logo?: React.ReactNode;
  defaultValue?: string;
  checkedCount?: number;
  renderDropdown?: boolean;
  children?: React.ReactChildren | Array<React.ReactChildren>;
  onChange?: () => {};
}

const AppContextSwitcher = (props: IProps) => {
  const {
    label,
    logo,
    defaultValue,
    checkedCount = 0,
    renderDropdown = true,
    children,
    onChange = noop,
  } = props;

  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const closeOnClickOutside = useDomWatcher(toggleDropdown, !isOpen);

  return (
    <div
      ref={closeOnClickOutside}
      className="marapp-qa-context-switcher ng-app-context-switcher  ng-position-relative"
    >
      <div className="ng-flex ng-padding-medium-horizontal ng-padding-small-top">
        {logo && (
          <div className="logo-container marapp-qa-logo" onClick={closeDropdown}>
            {logo}
            {renderDropdown && <span className="ng-margin-small-horizontal ng-color-white">|</span>}
          </div>
        )}

        {renderDropdown && (
          <>
            <div
              onClick={toggleDropdown}
              className="ng-c-cursor-pointer ng-flex ng-flex-middle ng-padding-horizontal ng-position-relative"
            >
              <div className="ng-text-display-s ng-text-weight-regular ng-color-white ng-margin-remove ng-org-name ng-padding-right">
                {label}
              </div>
              <i
                className={classnames({
                  'ng-icon ng-color-white': true,
                  'ng-icon-directionup': isOpen,
                  'ng-icon-directiondown': !isOpen,
                })}
              />
              {checkedCount > 0 && <span className="ng-org-badge">{checkedCount}</span>}
            </div>

            {isOpen && (
              <>
                <div className="overlay" onClick={closeDropdown} />
                <ul className="marapp-qa-dropdown ng-ep-dropdown">
                  {Children.map(children, (child: any) => {
                    if (!child) {
                      return;
                    }
                    const isOptionElement = child.props.value;
                    const selected = child.props.value === selectedValue;
                    return isOptionElement
                      ? cloneElement(child, {
                          selected,
                          onClick: (value: any) => {
                            if (!selected) {
                              setSelectedValue(value);
                              onChange(value);
                            }
                            closeDropdown();
                          },
                        })
                      : child;
                  })}
                </ul>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Child components
AppContextSwitcher.Option = Option;

export { AppContextSwitcher };
