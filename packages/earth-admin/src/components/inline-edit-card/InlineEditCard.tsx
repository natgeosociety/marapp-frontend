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

import React, { ReactNode, useState } from 'react';
import classnames from 'classnames';
import { animated, Keyframes } from 'react-spring/renderprops';
import { InlineCardButtons, InlineCardOverlay } from './index';

import './styles.scss';
import { ErrorMessages } from 'components/error-messages';

export interface InlineCardProps {
  editable?: boolean;
  isEditing?: boolean;
  isLoading?: boolean;
  hasButtons?: boolean;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  editAction?: ( v: boolean ) => void;
  saveAction?: ( v: boolean ) => void;
  children?: ReactNode;
  editForm?: ( setIsEditing: ( value: ((( prevState: boolean ) => boolean) | boolean) ) => void ) => {};
  serverErrors?: any;
  validForm?: boolean;
}

const Card: any = Keyframes.Spring({
  close: [{ x: 1 }],
  open: [{ x: 1.01 }, { x: 1 }],
});

export default function InlineEditCard( props: InlineCardProps ) {
  const { children, saveAction, editable, isLoading, editForm, hasButtons,
    primaryButtonText = 'save', secondaryButtonText = 'cancel', serverErrors, validForm } = props;


  const [isEditing, setIsEditing] = useState(false);
  const state = isEditing ? 'open' : 'close';

  return (
    <Card native state={state}>
      {( { x, ...props } ) => (
        <animated.div
          className={classnames({
            'ng-padding-medium ng-inline-card ng-background-ultradkgray': true,
            'ng-inline-card-editing': isEditing,
            'ng-inline-card-loading': isLoading,
          })}
          style={{
            transform: x
              .interpolate(x => `scale(${x})`),
            ...props,
          }}
        >
          {editable && !isEditing &&
          <button className="ng-button ng-button-link ng-edit-card-button"
                  onClick={( e ) => setIsEditing(true)}>edit</button>}

          {isEditing && editForm(setIsEditing)}
          {!isEditing && children}

          {serverErrors && <ErrorMessages errors={serverErrors}/>}

          {hasButtons && isEditing && <InlineCardButtons validForm={validForm}
                                                         primaryButtonText={primaryButtonText}
                                                         secondaryButtonText={secondaryButtonText}
                                                         editAction={( e ) => setIsEditing(false)}
                                                         saveAction={saveAction}/>}
          {isLoading && <div className="ng-inline-card-spinner"><i className="ng-icon-spinner ng-icon-spin"/></div>}
          {isEditing && <InlineCardOverlay show={isEditing}/>}
        </animated.div>
      )}
    </Card>

  );
}


