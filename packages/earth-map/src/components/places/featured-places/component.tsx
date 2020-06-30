import React from 'react';
import Link from 'redux-first-router-link';

import PLACEHOLDER from '../../../images/placeholder.png';

interface IFeaturedPlaces {
  featured?: {
    data: [];
  };
  list?: [];
  group?: string;
  setIndexesSelected?: (s: string) => any;
  setPlacesSearch?: (s: string) => any;
}

const FeaturedPlacesComponent = (props: IFeaturedPlaces) => {
  const { featured, setIndexesSelected, list, setPlacesSearch, group } = props;

  const onClickIndex = (slug) => {
    // @ts-ignore
    setPlacesSearch({ search: slug });
    // @ts-ignore
    !!list[0] && setIndexesSelected(list[0].slug);
  };

  return (
    <div className="ng-padding-medium ng-section-background ng-position-relative">
      <h2 className="ng-text-display-s ng-body-color ng-margin-medium-bottom">Featured places</h2>
      <div>
        {!!featured.data &&
          featured.data.map((place: any) => {
            const { slug, name, id, organization } = place;
            return (
              <Link
                key={slug}
                to={{ type: 'LOCATION', payload: { slug, id, organization } }}
                className="ng-c-panel-link ng-unstyled ng-flex ng-margin-bottom"
              >
                <span onClick={() => onClickIndex(name)}>
                  {name}
                  {group.length > 1 && (
                    <span className="ng-margin-left ng-color-mdgray">{organization}</span>
                  )}
                </span>
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default FeaturedPlacesComponent;
