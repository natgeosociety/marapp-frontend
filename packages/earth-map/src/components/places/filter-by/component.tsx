import React, { useState } from 'react';
import classnames from 'classnames';

import { cleanFilters } from 'utils/filters';

import './styles.scss';

const FilterComponent = (props: any) => {
  const { search, setPlacesSearch } = props;
  const { filters, availableFilters } = search;
  const [dropdownState, setDropdownState] = useState('close');

  const toggleFilter = (key: string, value: string) => {
    const filterGroup = filters[key] || [];
    const exists = filterGroup.includes(value);
    const newFilters = {
      [key]: exists ? filterGroup.filter((x) => x !== value) : [...filterGroup, value],
    };

    setPlacesSearch({
      filters: cleanFilters({
        ...filters,
        ...newFilters,
      }),
    });
  };

  const handleDropdown = () => {
    setDropdownState(dropdownState === 'open' ? 'close' : 'open');
  };

  return (
    <div className="ng-padding-medium ng-ep-background-dark ng-padding-top-remove ng-overflow-hidden">
      <h2 className="ng-text-display-s ng-body-color ng-margin-bottom">
        Search filters
        <i
          className={classnames({
            'ng-margin-small-left': true,
            'ng-icon-directionup': dropdownState === 'open',
            'ng-icon-directiondown': dropdownState !== 'open',
          })}
          onClick={handleDropdown}
        />
      </h2>
      {dropdownState === 'open' &&
        Object.keys(availableFilters).map((key) => (
          <>
            {/* {<h2 className="ng-color-ltgray ng-text-display-s ng-margin-bottom">{key}</h2>} */}
            <div className="ng-grid ng-form-dark ng-form" key={`${key}-form`}>
              {availableFilters[key].map((filter, i) => {
                const checked = !!(filters[key] && filters[key].includes(filter.value));
                const domId = `${key}-${filter.value}`;
                const disabled = filter.count === 0;

                return (
                  <div className="ng-width-1-2 ng-margin-bottom" key={`${key}-${i}`}>
                    <label
                      htmlFor={domId}
                      className={classnames({
                        'ng-c-cursor-pointer': true,
                        'with-count': true,
                        disabled,
                      })}
                    >
                      <input
                        className="ng-checkbox-input"
                        type="checkbox"
                        disabled={disabled}
                        checked={checked}
                        id={domId}
                        value={filter.value}
                        name={domId}
                        onChange={(e) => toggleFilter(key, e.target.value)}
                      />
                      <span>
                        {filter.label} <em>({filter.count})</em>
                      </span>
                    </label>
                  </div>
                );
              })}
            </div>
          </>
        ))}
    </div>
  );
};

export default FilterComponent;
