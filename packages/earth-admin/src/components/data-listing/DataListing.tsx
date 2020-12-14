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

import List from '@researchgate/react-intersection-list';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Spinner } from '@marapp/earth-shared';

import { useAuth0 } from '@app/auth/auth0';

import { SearchBox } from './search-box';
import './styles.scss';

interface DataListingProps {
  categoryUrl: string;
  childComponent: React.ElementType;
  pageSize: number;
  selectedItem?: string;
  pageTitle?: string;
  searchValueAction?: (val: string) => void;
  searchValue?: string;

  // useInfiniteListProps
  data: any;
  totalResults: number;
  onIntersection?: () => void;
  isLoading: boolean;
  awaitMore: boolean;
  isNoMore: boolean;
}

const DataListing = (props: DataListingProps) => {
  const {
    onIntersection,
    data,
    isLoading,
    isNoMore,
    searchValue,
    searchValueAction,
    categoryUrl,
    pageTitle,
    childComponent,
    pageSize,
    totalResults,
    selectedItem,
    awaitMore,
    ...otherProps
  } = props;
  const { selectedGroup } = useAuth0();
  const { t } = useTranslation('admin');

  return (
    <>
      {searchValueAction && (
        <SearchBox
          searchValue={searchValue}
          pageTitle={pageTitle}
          searchValueAction={searchValueAction}
        />
      )}
      <div style={{ overflowY: 'scroll' }} className="marapp-qa-datalisting ng-shadow-small">
        {!!totalResults && (
          <div className="ng-padding-medium-horizontal ng-padding-medium-top ng-padding-bottom ng-background-ultradkgray">
            <h4 className="ng-text-display-s ng-color-ultraltgray ng-margin-remove">
              {selectedGroup} {t(pageTitle)} &nbsp;
              <span className="ng-color-mdgray">({totalResults})</span>
            </h4>
          </div>
        )}

        <div className="ng-results-container">
          <List
            awaitMore={awaitMore}
            pageSize={pageSize}
            itemCount={data.length}
            renderItem={(index) => {
              const item = data[index];
              return (
                <div key={item.slug}>
                  {React.createElement(childComponent, {
                    item,
                    categoryUrl,
                    selected: selectedItem === item.id,
                  })}
                </div>
              );
            }}
            onIntersection={onIntersection}
            {...otherProps}
          />
          {!searchValue && isNoMore && (
            <div className=" ng-text-center">
              <p className=" ng-color-gray-3 ng-margin-medium-top ng-margin-bottom-remove">
                - {t('end')} -
              </p>
            </div>
          )}
        </div>
        {isLoading && <Spinner position="relative" />}
      </div>
    </>
  );
};

export default DataListing;
