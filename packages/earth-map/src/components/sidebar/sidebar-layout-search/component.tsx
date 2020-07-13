import React from 'react';
import { Keyframes, animated } from 'react-spring';

import Layers from 'components/layers';
import Header from 'components/header';

import SearchBox from 'components/places/searchbox';
import Filter from 'components/places/filter-by';
import ListItem from 'components/list-item';
import FeaturedPlaces from 'components/places/featured-places';
import PlacesResults from 'components/places/list';
import IndexSidebar from 'components/index-sidebar';
import { hasFilters } from 'utils/filters';

import './styles.scss';

const LayersDropdown: any = Keyframes.Spring({
  close: { x: `-100vh`, delay: 0 },
  open: { x: '0vh', from: { x: '0vh' } },
});

interface IProps {
  search?: any;
  group?: string[];
  places?: any;
  layersPanel?: boolean;
  selected?: boolean;
  locationName?: string;
  locationOrganization?: string;
  lastViewedPlace?: any;
  setPlacesSearch?: Function;
  setPlacesSearchOpen?: Function;
}

const SidebarLayoutSearch = (props: IProps) => {
  const {
    layersPanel,
    selected,
    search,
    group,
    setPlacesSearchOpen,
    locationName,
    locationOrganization,
    setPlacesSearch,
    lastViewedPlace,
  } = props;
  const { open } = search;
  const state = layersPanel ? 'open' : 'close';
  const hasSearchTerm = !!search.search;
  const withFilters = hasFilters(search.filters);
  const showResults = hasSearchTerm || withFilters;
  const showFilter = !selected || open;
  const showBack = selected && open && showResults;
  const showX = selected || hasSearchTerm;
  const handleBack = () => {
    if (selected) {
      setPlacesSearch({ search: locationName });
    }
    setPlacesSearchOpen(false);
  }

  const onLocationPage = selected && open && showResults;
  const onHomepage = !selected && showResults;
  const showLastViewedPlace = lastViewedPlace && group.includes(lastViewedPlace.organization)

  return (
    <>
      <LayersDropdown native state={state}>
        {({ x, ...props }) => (
          <animated.div
            className="c-layers ng-ep-background-dark"
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
        <div className="ng-sticky-top ng-margin-bottom">
          <Header />
          <SearchBox showClose={showX} />
          {showFilter && <Filter />}
          {showBack && (
            <div
              onClick={handleBack}
              className="ng-c-cursor-pointer ng-padding-vertical ng-padding-medium-horizontal ng-ep-background-dark ng-ep-border-top">
              <em className="ng-color-white">
                Return to {locationName}<span className="ng-icon-bullet ng-margin-small-horizontal" /><span className="ng-color-mdgray">{locationOrganization}</span>
              </em>
            </div>
          )}
        </div>
        {(onLocationPage || onHomepage)
          ? <PlacesResults />
          : selected
            ? <IndexSidebar />
            : (
              <>
                {(showLastViewedPlace && <LastViewedPlace place={lastViewedPlace} />)}
                <FeaturedPlaces />
              </>
            )}
      </div>
    </>
  )
};

const LastViewedPlace = ({ place }) => {
  const { name, slug, id, organization, type } = place;
  return (
    <div className="ng-section-background ng-position-relative ng-padding-medium-bottom ng-margin-bottom">
      <h2 className="ng-padding-medium ng-text-display-s ng-body-color ng-margin-remove">Last viewed place</h2>
      <ListItem
        title={name} key={slug}
        linkTo={{ type: 'LOCATION', payload: { slug, id, organization } }}
        labels={[ type, organization ]} />
    </div>
  )
}

export default SidebarLayoutSearch;