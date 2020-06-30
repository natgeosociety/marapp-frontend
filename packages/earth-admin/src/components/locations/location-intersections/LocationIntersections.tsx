import * as React from 'react';

import { LinkWithOrg } from 'components/LinkWithOrg';
import { LocationIntersectionProps } from '../model';

export default function LocationIntersections(props: LocationIntersectionProps) {
  const { intersections, name } = props;

  return (
    <div className="ng-flex ng-flex-column ng-margin-medium-bottom">
      <h5 className="ng-text-display-s ng-margin-small-bottom">{name} Intersections</h5>
      <div className="ng-flex ng-flex-wrap">
        {intersections.map((int) => (
          <LinkWithOrg to={`/locations/${int.id}`} key={int.id} className="ng-margin-medium-right">
            {int.name}
          </LinkWithOrg>
        ))}
      </div>
    </div>
  );
}
