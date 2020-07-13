import * as React from 'react';
import { OrganizationDataListing } from 'components/data-listing';
import { OrganizationContext } from 'utils/contexts';

export default function OrganizationList() {
  return (
    <OrganizationContext.Consumer>
      {({ organizations, handleCursorChange, isLoading, isNoMore }) =>
        organizations && (
          <OrganizationDataListing
            data={organizations}
            categoryUrl={'organizations'}
            pageTitle="ORGANIZATIONS"
            cursorAction={handleCursorChange}
            isLoading={isLoading}
            isNoMore={isNoMore}
          />
        )
      }
    </OrganizationContext.Consumer>
  );
}
