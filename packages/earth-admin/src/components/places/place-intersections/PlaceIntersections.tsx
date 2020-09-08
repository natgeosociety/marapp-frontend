/*
  Copyright 2018-2020 National Geographic Society

  Use of this software does not constitute endorsement by National Geographic
  Society (NGS). The NGS name and NGS logo may not be used for any purpose without
  written permission from NGS.

  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at

      https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed
  under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
  CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

import * as React from 'react';

import { LinkWithOrg } from 'components/link-with-org';
import { PlaceIntersectionProps } from 'pages-client/places/model';

export default function PlaceIntersections( props: PlaceIntersectionProps) {
  const { intersections, name } = props;

  return (
    <div className="marapp-qa-placesintersections ng-flex ng-flex-column ng-margin-medium-bottom">
      <p className="ng-text-weight-bold ng-margin-small-bottom">{name} Relationships</p>
      <div className="ng-flex ng-flex-wrap ng-padding-left">
        {intersections.map((int) => (
          <LinkWithOrg to={`/places/${int.id}`} key={int.id} className="marapp-qa-actionintersection ng-margin-medium-right">
            {int.name}
          </LinkWithOrg>
        ))}
      </div>
    </div>
  );
}
