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

import { LinkWithOrg } from 'components/link-with-org';
import { Spinner } from '@marapp/earth-components';
import './styles.scss';

interface OrganizationDataListingProps {
  data: any;
  categoryUrl: string;
  pageTitle?: string;
  cursorAction?: () => {};
  isLoading: boolean;
  isNoMore?: boolean;
}

const OrganizationDataListing = (props: OrganizationDataListingProps) => {
  const dataContainer = React.createRef();
  const {
    data,
    categoryUrl,
    pageTitle,
    cursorAction,
    isLoading,
    isNoMore,
  } = props;

  window.addEventListener(
    'scroll',
    (e) => {
      if (!isNoMore && !isLoading && dataContainer && dataContainer.current) {
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
                    <span className="ng-display-block">{item.description}</span>
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

export default OrganizationDataListing;
