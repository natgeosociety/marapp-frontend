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

import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import React from 'react';

import { Spinner } from '@marapp/earth-shared';

import Widgets from '../../components/widgets';
import { IWidget } from '../../modules/widget/model';
import WidgetSkeleton from '../WidgetSkeleton';
import './styles.scss';

interface ILIst {
  slug: string;
}

interface IIndexContent {
  place?: {};
  state?: string;
  widgets?: [];
  loading?: boolean;
  list?: ILIst[];
  metricsLoading?: boolean;
  widgetsLoading?: boolean;
}

class IndexContentComponent extends React.PureComponent<IIndexContent> {
  public render() {
    const { place, widgets, metricsLoading, widgetsLoading } = this.props;

    if (isEmpty(place) || metricsLoading || widgetsLoading) {
      return <WidgetSkeleton />;
    }

    return (
      <div>
        <React.Fragment>
          <div className="index-content--section marapp-qa-indexcontent">
            <Widgets
              place={place}
              slugs={sortBy(widgets, ['organization', 'name'])
                .filter((w: IWidget) => !!w.slug)
                .map((w: IWidget) => {
                  return {
                    slug: w.slug,
                    collapsed: false,
                    box: true,
                  };
                })}
            />
          </div>
        </React.Fragment>
      </div>
    );
  }
}

export default IndexContentComponent;
