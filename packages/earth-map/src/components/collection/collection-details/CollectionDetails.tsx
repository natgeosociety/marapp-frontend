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

import React from 'react';

import { Card, Spinner } from '@marapp/earth-shared';

interface IProps {
  data?: any;
  loading?: boolean;
  error?: any;
}

const CollectionDetails = (props: IProps) => {
  const { loading, data } = props;

  if (loading) {
    return <Spinner />;
  }

  const { organization, name } = data;

  return (
    <div>
      <Card elevation="flush" className="ng-widget-header">
        <h3 className="ng-text-display-s ng-margin-bottom">
          {organization} | <span className="ng-text-weight-regular">Collection</span>
        </h3>
        <h2 className="ng-text-edit-m ng-body-color ng-margin-remove">{name}</h2>
      </Card>

      <Card className="c-legend-item-group">
        <h2 className="ng-text-display-s ng-body-color ng-margin-bottom">Collection places</h2>
        <p>
          You currently don’t have any places added to your collection. Add places to your
          collection to access data metrics and share your insights with your team.
        </p>
        <button
          disabled={true}
          type="submit"
          className="ng-button ng-button-secondary ng-margin-right"
        >
          Add places
        </button>
      </Card>
    </div>
  );
};

export default CollectionDetails;
