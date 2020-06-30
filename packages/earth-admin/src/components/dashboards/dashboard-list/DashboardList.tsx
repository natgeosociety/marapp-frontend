import * as React from 'react';
import { DataListing } from 'components/data-listing';
import { DashboardContext } from 'utils/contexts';

export default function DashboardList() {
  return (
    <DashboardContext.Consumer>
      {({ dashboards, handleSearchValueChange, handleCursorChange, isLoading, isNoMore, searchValue }) =>
        dashboards && (
          <DataListing
            data={dashboards}
            categoryUrl={'dashboards'}
            pageTitle="DASHBOARDS"
            searchValueAction={handleSearchValueChange}
            cursorAction={handleCursorChange}
            isLoading={isLoading}
            isNoMore={isNoMore}
            searchValue={searchValue}
          />
        )
      }
    </DashboardContext.Consumer>
  );
}
