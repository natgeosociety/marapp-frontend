import React from 'react';

import ListItem from 'components/list-item';
import { IPlace } from 'modules/places/model';

interface IProps {
  place: IPlace;
};

export const LastViewedPlace = ({ place }: IProps) => {
  const { name, slug, id, organization, type } = place;

  return (
    <div className="ng-section-background ng-position-relative ng-padding-medium-bottom ng-margin-bottom">
      <h2 className="ng-padding-medium ng-text-display-s ng-body-color ng-margin-remove">Last viewed place</h2>
      <ListItem
        title={name} key={slug}
        linkTo={{ type: 'LOCATION', payload: { slug, id, organization } }}
        labels={[type, organization]} />
    </div>
  )
};