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

import React, { useEffect, useState } from 'react';
import classnames from 'classnames';

import Link from 'redux-first-router-link';
import './styles.scss';

interface ISearchbox {
  setPlacesSearch?: (value: any) => {};
  setSidebarLayers?: (value: any) => {};
  setIndexesSelected?: (value: any) => {};
  setPlacesSearchOpen?: (value: any) => {};
  setPlace?: (value: any) => {};
  setMapBounds?: (value: any) => {};
  resetMap?: () => {};
  resetLayers?: () => {};
  resetPlace?: () => {};
  search?: any;
  open?: boolean;
  showClose?: boolean;
}

const SearchBox = (props: ISearchbox) => {
  const {
    setPlacesSearch,
    setSidebarLayers,
    setIndexesSelected,
    setPlacesSearchOpen,
    resetMap,
    resetPlace,
    search,
    open,
    showClose,
  } = props;

  const handleChange = (e) => {
    const newValue = e.target.value;
    setPlacesSearch({ search: newValue });
  };

  const handleToggleClick = () => {
    setSidebarLayers(true);
  };

  const handleResetLocation = () => {
    resetPlace();
    setPlacesSearch({ search: '' });
    setIndexesSelected('');
    resetMap();
  };

  const searchBoxClasses = classnames(
    'ng-c-input-container',
    'ng-background-ultradkgray',
    'ng-background-ultradkgray',
    'ng-padding-vertical',
    'ng-c-flex-grow-1',
    'ng-flex',
    'ng-flex-middle',
    {
      'is-focused': open,
    }
  );

  return (
    <div className="ng-padding-medium ng-flex ng-ep-background-dark ng-padding-top-remove">
      <div className={searchBoxClasses}>
        <i className="ng-icon ng-icon-small ng-icon-search ng-color-mdgray ng-margin-small-horizontal" />
        <input
          type="text"
          placeholder="search a place"
          className="ng-width-1-1 ng-search-box"
          value={search}
          onChange={(e) => handleChange(e)}
          onFocus={() => setPlacesSearchOpen(true)}
        />
        {showClose && (
          <Link to={{ type: 'EARTH' }} className="ng-c-panel-link ng-unstyled ng-flex">
            <div onClick={() => handleResetLocation()}>
              <i className="ng-color-mdgray ng-margin-small-right ng-icon-small ng-icon-close ng-display-block"></i>
            </div>
          </Link>
        )}
      </div>
      <div
        className="ng-icon-toggle-layer ng-labeled-icon ng-flex-column ng-flex-center ng-flex ng-margin-medium-left"
        onClick={() => handleToggleClick()}
      >
        <i className="ng-icon ng-icon-small ng-icon-layers ng-width-1-1 ng-text-center ng-margin-small-bottom" />
        <label className="ng-icon-label ng-width-1-1 ng-text-center">Layers</label>
      </div>
    </div>
  );
};

export default SearchBox;
