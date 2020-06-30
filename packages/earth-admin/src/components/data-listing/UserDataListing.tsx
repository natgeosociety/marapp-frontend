import * as React from 'react';

import { LinkWithOrg } from 'components/LinkWithOrg';
import { Spinner } from '@marapp/earth-components';
import './styles.scss';

interface UserDataListingProps {
  data: any;
  categoryUrl: string;
  pageTitle?: string;
  cursorAction?: () => {};
  isLoading: boolean;
  isNoMore?: boolean;
}

const UserDataListing = (props: UserDataListingProps) => {
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
                    <span className="ng-display-block">{item.email}</span>
                    <span className="ng-display-block">{item.groups.map(group => group.name).join(', ')}</span>
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

export default UserDataListing;
