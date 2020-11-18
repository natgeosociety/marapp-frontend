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

import { useDomWatcher } from '@marapp/earth-shared';

import './styles.scss';

interface IProps {
  trigger: (open: boolean) => React.ReactElement;
  children: any[];
  listLabel?: string;
}

export function DropdownSimple(props: IProps) {
  const { trigger, children, listLabel } = props;
  const [showDropdown, setShowDropdown] = useState(false);
  const closeOnClickOutside = useDomWatcher(setShowDropdown, !showDropdown);

  const triggerElement = trigger(showDropdown);

  return (
    <div className="dropdown-simple ng-position-relative" ref={closeOnClickOutside}>
      {React.cloneElement(triggerElement, {
        onClick: () => setShowDropdown(!showDropdown),
        className: `ng-cursor-pointer ${triggerElement.props.className}`,
      })}

      {showDropdown && (
        <div className="dropdown-simple-menu">
          {listLabel && (
            <p className="ng-text-display-s ng-padding-medium-horizontal ng-padding-vertical ng-margin-remove">
              {listLabel}
            </p>
          )}
          <ul className="marapp-qa-dropdown">
            {React.Children.map(children, (child) => {
              const standardItem = React.cloneElement(child, {
                className: 'ng-border-remove ng-display-block',
                onClick: (e) => {
                  child.props.onClick?.(e);
                  setShowDropdown(!showDropdown);
                },
              });
              return <li>{standardItem}</li>;
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
