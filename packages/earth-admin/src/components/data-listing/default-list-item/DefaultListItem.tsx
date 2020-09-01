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
import classnames from 'classnames';

import { LinkWithOrg } from 'components';

interface DataListProps {
  categoryUrl: string;
  item: { name: string; id: string; slug: string };
  selectedItem: string;
}

const DefaultListItem = (props: DataListProps) => {
  const { categoryUrl, item, selectedItem } = props;


  return (
    <LinkWithOrg
      to={`/${categoryUrl}/${item.id}`}
      className={classnames('marapp-qa-listitem ng-data-link ng-display-block ng-padding-medium-horizontal ng-padding-small-vertical', {
        'ng-data-link-selected': selectedItem === item.id
      })}>
      <p className="ng-margin-remove ng-color-ultraltgray">{item.name}</p>
      <span className="ng-display-block ng-color-mdgray">{item.slug}</span>
    </LinkWithOrg>
  );
};

export default DefaultListItem;
