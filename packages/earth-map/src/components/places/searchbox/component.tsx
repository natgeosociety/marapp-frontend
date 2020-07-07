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

const SearchBoxComponent = (props: ISearchbox) => {
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

export default SearchBoxComponent;
