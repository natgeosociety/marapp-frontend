import React from 'react';

import ListItem from 'components/list-item';

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
    <div className="ng-section-background ng-position-relative">
      <h2 className="ng-padding-medium ng-text-display-s ng-body-color ng-margin-remove">Featured places</h2>
      <div>
        {!!featured.data &&
          featured.data.map((place: any) => {
            const { slug, name, id, organization, type } = place;

            return (
              <ListItem
                title={name} key={slug}
                linkTo={{ type: 'LOCATION', payload: { slug, id, organization } }}
                onClick={() => onClickIndex(name)}
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
