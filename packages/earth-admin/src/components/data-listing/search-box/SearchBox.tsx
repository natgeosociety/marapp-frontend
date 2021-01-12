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
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import './styles.scss';

interface SearchBoxProps {
  searchValue: string;
  searchValueAction: (s: string) => void;
  pageTitle: string;
}

const SearchBox = (props: SearchBoxProps) => {
  const { searchValue, searchValueAction, pageTitle } = props;
  const { t } = useTranslation('admin');
  const [focus, setFocus] = useState(false);

  const handleSearchChange = (newValue: string) => {
    searchValueAction(newValue);
  };

  const onReset = () => {
    handleSearchChange('');
  };

  return (
    <div
      className="marapp-qa-searchbox searchable-listing-container ng-background-dkgray
      ng-padding-medium-horizontal ng-padding-medium-bottom ng-shadow-large"
    >
      <div
        className={classnames({
          'ng-input-container ng-c-flex-grow-1 ng-flex ng-flex-middle ng-padding ng-padding-right-remove': true,
          'is-focused': focus,
        })}
      >
        <i className="ng-icon ng-icon-small ng-icon-search ng-color-mdgray ng-margin-small-horizontal ng-margin-left-remove" />
        <input
          type=" text"
          placeholder={`${t('search')} ${t(pageTitle).toLowerCase()}...`}
          className=" ng-width-1-1 ng-search-box"
          onFocus={() => setFocus(true)}
          onChange={(e) => handleSearchChange(e.target.value)}
          value={searchValue}
        />
        {searchValue && (
          <div className="marapp-qa-searchboxclear ng-c-cursor-pointer" onClick={onReset}>
            <i className="ng-color-mdgray ng-margin-horizontal ng-icon ng-icon-close ng-display-block" />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBox;
