import * as React from 'react';
import { useState } from 'react';

import { LinkWithOrg } from 'components/LinkWithOrg';
import { Spinner } from '@marapp/earth-components';
import './styles.scss';

interface DataListingProps {
  data: any;
  categoryUrl: string;
  pageTitle?: string;
  searchValueAction?: (val: string) => {};
  cursorAction?: () => {};
  isLoading: boolean;
  isNoMore?: boolean;
  searchValue?: string;
}

const DataListing = (props: DataListingProps) => {
  const dataContainer = React.createRef();

  const {
    data,
    categoryUrl,
    pageTitle,
    searchValueAction,
    cursorAction,
    isLoading,
    isNoMore,
    searchValue
  } = props;

  const handleSearchChange = (newValue: string) => {
    searchValueAction(newValue);
  };

  window.addEventListener(
    'scroll',
    (e) => {
      if (!isLoading && dataContainer && dataContainer.current) {
        const position = dataContainer.current.getBoundingClientRect();
        if (position.bottom <= window.innerHeight) {
          cursorAction();
        }
      }
    },
    true
  );

  return (
    <div>
      <h2 className="ng-text-display-m">{pageTitle}</h2>
      {!!data && (
        <div>
          <div className="searchable-listing-container ng-width-1-1 ng-margin-small-bottom">
            <input
              type="text"
              placeholder={`Search for ${pageTitle.toLowerCase()}...`}
              className="ng-padding ng-width-1-1"
              onChange={(e) => handleSearchChange(e.target.value)}
              value={searchValue}
              ref={input => input && input.getBoundingClientRect().top > 0 && input.focus()}
            />
          </div>
          {data && (
            <div ref={dataContainer}>
              {data.map((item, index) => {
                return (
                  <LinkWithOrg
                    to={`/${categoryUrl}/${item.id}`}
                    className="ng-c-data-link ng-display-block ng-padding-medium-horizontal ng-padding-vertical"
                    key={index}
                  >
                    <span className="ng-text-edit-s ng-margin-remove">{item.name}</span>
                    <span className="ng-display-block">{item.slug}</span>
                  </LinkWithOrg>
                );
              })}
            </div>
          )}
          {isNoMore && (
            <div className="ng-text-center">
              <p className="ng-color-gray-3 ng-margin-medium-top ng-margin-bottom-remove">
                - end -
              </p>
            </div>
          )}
          {isLoading && (
            <Spinner position="relative" />
          )}
        </div>
      )}
    </div>
  );
};

export default DataListing;
