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
import { LinkWithOrg } from '../../link-with-org';

interface Auth0ListProps {
  categoryUrl: string;
  item: { id: string; name: string; email: string; groups: { name: string }[] };
}

const Auth0ListItem = ( props: Auth0ListProps ) => {
  const { categoryUrl, item } = props;

  return (
    <LinkWithOrg
      to={`/${categoryUrl}/${item.id}`}
      className="marapp-qa-auth0listitem ng-data-link ng-display-block ng-padding-medium-horizontal ng-padding-small-vertical"
    >
      <p className="ng-margin-remove ng-color-ultraltgray">{item.name}</p>
      {!!item.groups &&
      <span className="ng-display-block ng-color-mdgray">{item.groups.map(( group ) => group.name).join(', ')}</span>}
    </LinkWithOrg>
  );
};

export default Auth0ListItem;
