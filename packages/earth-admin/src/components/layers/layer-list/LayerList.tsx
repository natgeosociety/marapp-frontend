import * as React from 'react';
import { DataListing } from 'components/data-listing';
import { LayerContext } from 'utils/contexts';

export default function LayerList() {
  return (
    <LayerContext.Consumer>
      {({ layers, handleSearchValueChange, handleCursorChange, isLoading, isNoMore, searchValue }) =>
        layers && (
          <DataListing
            data={layers}
            categoryUrl={'layers'}
            pageTitle="LAYERS"
            searchValueAction={handleSearchValueChange}
            cursorAction={handleCursorChange}
            isLoading={isLoading}
            isNoMore={isNoMore}
            searchValue={searchValue}
          />
        )
      }
    </LayerContext.Consumer>
  );
}
