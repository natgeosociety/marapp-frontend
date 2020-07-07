import React from 'react';
import { Keyframes, animated } from 'react-spring';
import { Spinner } from '@marapp/earth-components';

import Layers from 'components/layers';
import OrgSwitcher from 'components/org-switcher';

import SearchBox from 'components/places/searchbox';
import Filter from 'components/places/filter-by';
import FeaturedPlaces from 'components/places/featured-places';
import PlacesResults from 'components/places/list';
import IndexSidebar from 'components/index-sidebar';
import { hasFilters } from 'utils/filters';

const LayersDropdown: any = Keyframes.Spring({
  close: { x: `-100vh`, delay: 0 },
  open: { x: '0vh', from: { x: '0vh' } },
});

interface IProps {
  search?: any;
  places?: any;
  layersPanel?: boolean;
  selected?: boolean;
  locationName?: string;
  locationOrganization?: string;
  setPlacesSearchOpen?: Function;
}

const SidebarLayoutSearch = (props: IProps) => {
  const {
    layersPanel,
    selected,
    search,
    setPlacesSearchOpen,
    locationName,
    locationOrganization,
  } = props;
  const { open } = search;
  const state = layersPanel ? 'open' : 'close';
  const hasSearchTerm = !!search.search;
  const withFilters = hasFilters(search.filters);
  const showFilter = !selected || open;
  const showBack = selected && open;
  const showResults = hasSearchTerm || withFilters;
  const showCloseLocation = selected && !open;

  return (
    <>
      <LayersDropdown native state={state}>
        {({ x, ...props }) => (
          <animated.div
            className="c-layers ng-section-background -active"
            style={{
              transform: x.interpolate((x) => `translate3d(0,${x},0)`),
              ...props,
            }}
          >
            <Layers />
          </animated.div>
        )}
      </LayersDropdown>
      <div style={{ height: '100%', overflow: 'auto' }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 1 }}>
          <OrgSwitcher />
          <SearchBox showClose={showCloseLocation} />
          {showFilter && <Filter />}
          {showBack && (
            <div className="ng-c-cursor-pointer ng-padding-vertical ng-padding-medium-horizontal ng-ep-background-dark ng-ep-border-top">
              <em className="ng-color-white" onClick={() => setPlacesSearchOpen(false)}>
                Return to {locationName}<span className="ng-icon-bullet ng-margin-small-horizontal"/><span className="ng-color-mdgray">{locationOrganization}</span>
              </em>
            </div>
          )}
        </div>
        {renderContent(open, selected, search.loading, showResults)}
      </div>
    </>
  )
};

const renderContent = (open, selected, loading, showResults) => {
  if (loading) {
    return <Spinner position="relative" />
  }
  return (open && showResults)
    ? <PlacesResults />
    : selected
      ? <IndexSidebar />
      : <FeaturedPlaces />
}

export default SidebarLayoutSearch;