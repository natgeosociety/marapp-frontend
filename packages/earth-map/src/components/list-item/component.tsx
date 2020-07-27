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
import Link from 'redux-first-router-link';
import { parseHintBold } from 'utils';

import './style.scss';

interface IProps {
  title: string;
  linkTo: {
    type: string;
    payload?: any;
  };
  key: string;
  organization?: string;
  hint?: string;
  list?: any[];
  labels?: string[];
  setPlacesSearch?: (payload) => void;
  setIndexesSelected?: (payload) => void;
  onClick?: () => void;
}

const ListItem = (props: IProps) => {
  const {
    title,
    hint,
    labels,
    organization,
    linkTo,
    key,
    list,
    setPlacesSearch,
    setIndexesSelected,
    onClick,
  } = props;

  // Default click action. Can be overritten by passing onClick prop
  const onClickIndex = () => {
    setPlacesSearch({ search: title });
    const [first] = list;
    if (!!first) {
      setIndexesSelected(first.slug);
    }
  };

  return (
    <Link
      to={linkTo}
      onClick={onClick || onClickIndex} key={key}
      className="ng-list-item ng-padding-small-vertical ng-padding-medium-horizontal"
    >
      <span className="ng-display-block ng-list-item-title">{parseHintBold(hint || title)}</span>
      {organization && (
        <span className="ng-color-mdgray" key={`${organization}`}>
          {organization}<strong className="ng-icon-bullet" />
        </span>
      )}
      {labels.map((label, i, all) => {
        const last = i === all.length - 1;
        return (
          <span className="ng-color-mdgray" key={`${label}`}>
            {label}
            {!last && ', '}
          </span>
        )
      })}
    </Link>
  )
};

export default ListItem;