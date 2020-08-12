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
import { ReactNode, useContext, useEffect, useState } from 'react';
import { InlineCardOverlay } from './index';

export interface InlineCardProps {
  editable?: boolean;
  isEditing?: boolean;
  isLoading?: boolean;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  editAction?: ( v: boolean ) => void;
  saveAction?: ( v: boolean ) => void;
  children?: ReactNode
}

import './styles.scss';
import { animated, Keyframes } from 'react-spring/renderprops';
import classnames from 'classnames';

const Card: any = Keyframes.Spring({
  close: [{ x: 1 }],
  open: [{ x: 1.01 }, { x: 1 }],
});

export default function InlineCard( props: InlineCardProps ) {
  const { children, editAction, editable, isEditing, isLoading } = props;

  const editCard = () => {
    editAction(true);
  };

  const state = isEditing ? 'open' : 'close';

  return (
    <Card native state={state}>
      {( { x, ...props } ) => (
        <animated.div
          className={classnames({
            'ng-padding-medium ng-inline-card ng-background-ultradkgray': true,
            'ng-inline-card-editing': isEditing,
            'ng-inline-card-loading': isLoading
          })}
          style={{
            transform: x
              .interpolate(x => `scale(${x})`),
            ...props,
          }}
        >
          {editable && !isEditing &&
          <button className="ng-button ng-button-link ng-edit-card-button" onClick={editCard}>edit</button>}
          {isLoading && <div className="ng-inline-card-spinner"><i className="ng-icon-spinner ng-icon-spin"/></div>}
          {children}
          {isEditing && <InlineCardOverlay show={isEditing}/>}
        </animated.div>
      )}
    </Card>

  );
}


