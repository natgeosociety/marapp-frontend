import * as React from 'react';
import { UserDataListing } from 'components/data-listing';
import { UserContext } from 'utils/contexts';

export default function UserList() {
  return (
    <UserContext.Consumer>
      {({ users, handleCursorChange, isLoading, isNoMore }) =>
        users && (
          <UserDataListing
            data={users}
            categoryUrl={'users'}
            pageTitle="USERS"
            cursorAction={handleCursorChange}
            isLoading={isLoading}
            isNoMore={isNoMore}
          />
        )
      }
    </UserContext.Consumer>
  );
}
