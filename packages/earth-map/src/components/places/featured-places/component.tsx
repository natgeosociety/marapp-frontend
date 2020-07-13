import React from 'react';

import ListItem from 'components/list-item';

interface IFeaturedPlaces {
  featured?: {
    data: [];
  };
  group?: string;
}

const FeaturedPlacesComponent = (props: IFeaturedPlaces) => {
  const { featured, group } = props;

  return (
    <div className="ng-section-background ng-position-relative ng-padding-medium-bottom">
      <h2 className="ng-padding-medium ng-text-display-s ng-body-color ng-margin-remove">Featured places</h2>
      <div>
        {!!featured.data &&
          featured.data.map((place: any) => {
            const { slug, name, id, organization, type } = place;

            return (
              <ListItem
                title={name} key={slug}
                linkTo={{ type: 'LOCATION', payload: { slug, id, organization } }}
                labels={[
                  type,
                  (group.length > 1) && organization
                ]} />
            );
          })}
      </div>
    </div>
  );
};

export default FeaturedPlacesComponent;
