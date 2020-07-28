import * as React from 'react';
import classnames from 'classnames';
import {useState} from 'react';

import './styles.scss';

interface SearchBoxProps {
  searchValue: string,
  searchValueAction: (s: string) => void;
  pageTitle: string
}

const SearchBox = (props: SearchBoxProps) => {
  const {searchValue, searchValueAction, pageTitle} = props;
  const [focus, setFocus] = useState(false);

  const handleSearchChange = (newValue: string) => {
    searchValueAction(newValue);
  };

  return <div className="searchable-listing-container ng-margin-bottom ng-background-dkgray
      ng-padding-medium-horizontal ng-padding-medium-bottom">
    <div
      className={classnames({
        'ng-input-container ng-c-flex-grow-1 ng-flex ng-flex-middle ng-padding-vertical': true,
        'is-focused': focus
      })}>
      <i className="ng-icon ng-icon-small ng-icon-search ng-color-mdgray ng-margin-small-horizontal"/>
      <input
        type=" text"
        placeholder={`search ${pageTitle.toLowerCase()}...`}
        className=" ng-width-1-1 ng-search-box"
        onFocus={() => setFocus(!focus)}
        onChange={(e) => handleSearchChange(e.target.value)}
        value={searchValue}
        ref={input => input && input.getBoundingClientRect().top > 0 && input.focus()}
      />
    </div>

  </div>;
};

export default SearchBox;
