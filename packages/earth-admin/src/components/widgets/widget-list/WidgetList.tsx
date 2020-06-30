import * as React from 'react';
import { DataListing } from 'components/data-listing';
import { WidgetContext } from 'utils/contexts';

export default function WidgetList() {
  return (
    <WidgetContext.Consumer>
      {({ widgets, handleSearchValueChange, handleCursorChange, isLoading, isNoMore, searchValue }) =>
        widgets && (
          <DataListing
            data={widgets}
            categoryUrl={'widgets'}
            pageTitle="WIDGETS"
            searchValueAction={handleSearchValueChange}
            cursorAction={handleCursorChange}
            isLoading={isLoading}
            isNoMore={isNoMore}
            searchValue={searchValue}
          />
        )
      }
    </WidgetContext.Consumer>
  );
}
