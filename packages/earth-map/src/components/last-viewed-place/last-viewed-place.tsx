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

import ListItem from 'components/list-item';
import { IPlace } from 'modules/places/model';
import React from 'react';

interface IProps {
  place: {
    id: string;
    slug?: string;
    name?: string;
    organization?: string;
    mainType?: string;
    subType?: string;
  };
}

export const LastViewedPlace = ({ place }: IProps) => {
  const { name, slug, id, organization, mainType, subType } = place;

  return (
    <div className="marapp-qa-lastviewedplace ng-section-background ng-position-relative ng-padding-medium-bottom ng-margin-bottom">
      <h2 className="ng-padding-small-bottom ng-padding-medium-horizontal ng-padding-medium-top ng-text-display-s ng-body-color ng-margin-remove">
        Last viewed place
      </h2>
      <ListItem
        title={name}
        key={`${slug}-${organization}`}
        linkTo={{ type: mainType, payload: { slug, id, organization } }}
        organization={organization}
        labels={[subType]}
      />
    </div>
  );
};
