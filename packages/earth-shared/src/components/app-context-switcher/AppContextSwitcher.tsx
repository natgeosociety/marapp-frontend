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
    renderDropdown = false,
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
      className="marapp-qa-context-switcher ng-app-context-switcher ng-padding-medium-horizontal ng-ep-background-dark ng-flex ng-position-relative ng-padding-small-top"
    >
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
              <ul className="marapp-qa-dropdown ng-ep-dropdown ng-ep-background-dark">
                {Children.map(children, (child: any) => {
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
  );
};

// Child components
AppContextSwitcher.Option = Option;

export { AppContextSwitcher };
