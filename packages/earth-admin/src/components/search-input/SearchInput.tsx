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

import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { encodeQueryToURL } from 'utils';
import { getAllLayers, getAllWidgets, getAvailableGroups } from 'services';

import { remove } from 'lodash';
import { Auth0Context } from 'utils/contexts';
import { LinkWithOrg } from 'components/link-with-org';

interface SearchInputProps {
  options: any[];
  optionType: string;
  resultsLimit?: number;
  onChange?: (data) => void;
  placeholder?: string
}

export default function SearchInput(props: SearchInputProps) {
  const { options, optionType, resultsLimit, onChange, placeholder = 'Search layers to add...' } = props;
  const { selectedGroup } = useContext(Auth0Context);

  const [searchValue, setSearchValue] = useState('');
  const [availableOptions, setAvailableOptions] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [timer, setTimer] = useState(null);

  const searchRef = React.createRef();

  const baseUrl = optionType + '/';

  const OPTIONS_QUERY = {
    sort: `${optionType}.name`,
    page: { number: '1' },
    group: selectedGroup,
  };

  window.addEventListener('click', (e) => {
    if (isFocused && searchRef.current) {
      if (!searchRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    }
  });

  useEffect(() => {
    clearTimeout(timer);

    const initAvailableOptions = async () => {
      const encodedOptionsQuery = encodeQueryToURL(baseUrl, {
        ...OPTIONS_QUERY,
        ...{
          search: searchValue,
          page: { size: resultsLimit },
        },
      });
      const res: any =
        optionType === 'layers'
          ? await getAllLayers(encodedOptionsQuery)
          : optionType === 'userGroups' ? await getAvailableGroups(selectedGroup)
          : await getAllWidgets(encodedOptionsQuery);

      setAvailableOptions(res.data);
    };

    setTimer(
      setTimeout(() => {
        initAvailableOptions();
      }, 350)
    );
  }, [searchValue]);

  useEffect(() => {
    setSelectedOptions(options);
  }, [options]);

  const handleInputFocus = (e, status) => {
    e.preventDefault();

    setIsFocused(status);
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    setSearchValue(e.target.value);
  };

  const handleChange = (e, option) => {
    e.preventDefault();

    let tempOptions = !!selectedOptions ? [...selectedOptions] : [];
    const exists = tempOptions.includes(option);

    if (exists) {
      remove(tempOptions, (n: any) => n.id === option.id);
    } else {
      tempOptions = [...tempOptions, ...[option]];
    }

    setSelectedOptions(tempOptions);
    setSearchValue('');
    setAvailableOptions(null);

    const optionIds = extractIDs(tempOptions);

    onChange && onChange(optionIds);
  };

  const extractIDs = (options) => {
    let temp = [];
    options.map((option) => (temp = [...temp, ...[option.id]]));
    return temp;
  };

  return (
    <div className="search-container" ref={searchRef}>
      <div className="ng-flex ng-flex-wrap ng-margin-bottom ng-position-relative">
        {!!selectedOptions &&
          selectedOptions.map((option) => (
            <LinkWithOrg
              to={'/' + baseUrl + `${option.id}`}
              key={option.id}
              className="ng-margin-medium-right"
            >
              {option.name}
              <span
                className="ng-padding-left ng-icon-hover"
                onClick={(e) => handleChange(e, option)}
              >
                [x]
              </span>
            </LinkWithOrg>
          ))}
      </div>

      <div className="search-input-container">
        <input
          type="text"
          placeholder={placeholder}
          className="ng-width-1-1 ng-padding-horizontal ng-padding-medium-vertical"
          value={searchValue}
          onFocus={(e) => handleInputFocus(e, true)}
          onChange={(e) => handleInputChange(e)}
        />
        <div className="ng-position-relative">
          {isFocused && availableOptions && (
            <ul
              className="ng-position-absolute ng-c-position-z-index-10 ng-list ng-background-white
                         ng-box-shadow ng-padding-remove ng-width-1-1"
            >
              {availableOptions.map((option) => (
                <li
                  className="ng-padding-horizontal ng-padding-small-vertical ng-c-cursor-pointer ng-icon-hover"
                  onClick={(e) => handleChange(e, option)}
                  key={option.id}
                >
                  {option.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
