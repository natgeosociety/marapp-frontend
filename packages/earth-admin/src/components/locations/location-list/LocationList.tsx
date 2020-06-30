import * as React from 'react';
import { DataListing } from 'components/data-listing';
import { LocationContext } from 'utils/contexts';

export default function LocationList() {
  return (
    <LocationContext.Consumer>
      {({ locations, handleSearchValueChange, handleCursorChange, isLoading, isNoMore, searchValue }) =>
        locations && (
          <DataListing
            data={locations}
            categoryUrl={'locations'}
            pageTitle="LOCATIONS"
            searchValueAction={handleSearchValueChange}
            cursorAction={handleCursorChange}
            isLoading={isLoading}
            isNoMore={isNoMore}
            searchValue={searchValue}
          />
        )
      }
    </LocationContext.Consumer>
  );
}
