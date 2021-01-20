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

import classnames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { cleanFilters, countFilters } from '../../utils/filters';
import './styles.scss';

interface IProps {
  data: any;
  open: boolean;
  onOpenToggle: (payload?) => void;
  onChange: (payload?) => void;
}

const FilterBy = (props: IProps) => {
  const { data, open, onOpenToggle, onChange } = props;
  const { t } = useTranslation();
  const { filters, availableFilters } = data;
  const numberOfFilters = countFilters(filters);

  const toggleFilter = (key: string, value: string) => {
    const filterGroup = filters[key] || [];
    const exists = filterGroup.includes(value);
    const newFilters = {
      [key]: exists ? filterGroup.filter((x) => x !== value) : [...filterGroup, value],
    };
    onChange({
      filters: cleanFilters({
        ...filters,
        ...newFilters,
      }),
    });
  };

  const clearCheckedFilters = () =>
    onChange({
      filters: {},
    });
  const openToggle = () => onOpenToggle(!open);

  return (
    <div className="ng-filter-by marapp-qa-filterby ng-padding-vertical ng-padding-medium-horizontal ng-ep-background-dark ng-padding-top-remove ng-overflow-hidden">
      <div className="ng-flex search-title">
        <p
          className="marapp-qa-filterbyopen ng-text-display-s ng-body-color ng-margin-bottom ng-margin-small-right ng-c-cursor-pointer"
          onClick={openToggle}
        >
          {t('Filters')}
        </p>
        {numberOfFilters > 0 && (
          <a
            className="marapp-qa-filterbyclear ng-link ng-nohover ng-text-weight-regular ng-text-capital"
            onClick={clearCheckedFilters}
          >
            {t('Clear')} {`(${numberOfFilters})`}
          </a>
        )}
        <i
          className={classnames(
            'marapp-qa-filterbyarrow ng-c-cursor-pointer ng-margin-small-left',
            {
              'ng-icon-directionup': open,
              'ng-icon-directiondown': !open,
            }
          )}
          onClick={openToggle}
        />
      </div>
      {open &&
        Object.keys(availableFilters).map((key) => (
          <React.Fragment key={key}>
            {/* {<h2 className="ng-color-ltgray ng-text-display-s ng-margin-bottom">{key}</h2>} */}
            <div className="ng-grid ng-form-dark ng-form" key={`${key}-form`}>
              {availableFilters[key].map((filter, i) => {
                const checked = !!(filters[key] && filters[key].includes(filter.value));
                const domId = `${key}-${filter.value}`;
                const disabled = filter.count === 0;

                return (
                  <div
                    className={`marapp-qa-filter-option ng-width-1-2 ng-margin-bottom`}
                    key={`${filter.key}-${filter.value}`}
                  >
                    <label
                      htmlFor={domId}
                      className={classnames({
                        'ng-c-cursor-pointer': true,
                        'with-count': true,
                        disabled,
                      })}
                    >
                      <input
                        className={`marapp-qa-filter-option-${i} ng-checkbox-input`}
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
          </React.Fragment>
        ))}
    </div>
  );
};

export default FilterBy;
