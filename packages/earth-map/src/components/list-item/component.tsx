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

import { noop } from 'lodash';
import React from 'react';
import Link from 'redux-first-router-link';

import Toggle from '../../components/toggle';
import { parseHintBold } from '../../utils';
import './style.scss';

interface IProps {
  title: string;
  key?: string;
  active?: boolean;
  linkTo?: {
    type: string;
    payload?: any;
  };
  organization?: string;
  hint?: string;
  list?: any[];
  labels?: string[];
  onClick?: () => void;
}

const ListItem = (props: IProps) => {
  const { title, hint, labels, organization, linkTo, key, onClick = noop, active } = props;

  const showToggle = typeof active !== 'undefined';

  const Wrapper = linkTo ? Link : 'div';

  return (
    <Wrapper
      to={linkTo}
      onClick={onClick}
      key={key}
      className="marapp-qa-listitem ng-list-item ng-padding-small-vertical ng-padding-medium-horizontal ng-cursor-pointer"
    >
      {showToggle && <Toggle className="ng-margin-right" active={active} />}
      <div className="ng-list-item-content">
        <span className="ng-display-block ng-list-item-title">{parseHintBold(hint || title)}</span>
        {organization && (
          <span className="ng-color-mdgray" key={`${organization}`}>
            {organization}
            <strong className="ng-icon-bullet" />
          </span>
        )}
        {labels?.map((label, i, all) => {
          const last = i === all.length - 1;
          return (
            <span className="ng-color-mdgray" key={`${label}`}>
              {label}
              {!last && ', '}
            </span>
          );
        })}
      </div>
    </Wrapper>
  );
};

export default ListItem;
