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

import classnames from 'classnames';
import React, { ReactNode, useState } from 'react';
import { animated, Keyframes } from 'react-spring/renderprops';

import { ErrorMessages } from '@marapp/earth-shared/src/components/error-messages';

import { InlineCardOverlay } from './index';
import './styles.scss';

interface IOptionsBag {
  isEditing: boolean;
  isLoading: boolean;
  serverErrors: any[];
  setIsEditing: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setServerErrors: (value: boolean) => void;
}

export interface InlineCardProps {
  children: ReactNode;
  render?: (optionsBag: IOptionsBag) => React.ReactNode;
  editButtonText?: string;
  onSubmit?: (
    e: any,
    setIsEditing: (value: boolean) => void,
    setIsLoading: (value: boolean) => void,
    setServerErrors: (value: boolean) => void
  ) => void;
  submitButtonText?: string;
  cancelButtonText?: string;
  validForm?: boolean;
}

const Card: any = Keyframes.Spring({
  close: [{ x: 1 }],
  open: [{ x: 1.01 }, { x: 1 }],
});

export default function InlineEditCard(props: InlineCardProps) {
  const {
    children,
    render,
    editButtonText = 'edit',
    onSubmit,
    submitButtonText = 'Save',
    cancelButtonText = 'Cancel',
    validForm,
  } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState(null);

  const state = isEditing ? 'open' : 'close';

  const optionsBag: IOptionsBag = {
    isEditing,
    isLoading,
    serverErrors,
    setIsEditing,
    setIsLoading,
    setServerErrors,
  };

  const handleCancel = () => {
    setIsEditing(false);
    setServerErrors(false);
  };

  const renderEditable = () => (
    <>
      {render(optionsBag)}
      {serverErrors && <ErrorMessages errors={serverErrors} />}
      <InlineCardOverlay />
      <div className="ng-margin-medium-top">
        <button
          className="marapp-qa-actionsaveinline ng-button ng-button-primary ng-margin-right"
          disabled={!validForm}
          onClick={(e) => onSubmit(e, setIsEditing, setIsLoading, setServerErrors)}
        >
          {submitButtonText}
        </button>
        <button
          className="marapp-qa-actioncancelinline ng-button ng-button-secondary"
          onClick={handleCancel}
        >
          {cancelButtonText}
        </button>
      </div>
    </>
  );

  const renderDefault = () => (
    <>
      {render && (
        <button
          className="marapp-qa-actioneditinline ng-button ng-button-link ng-edit-card-button ng-text-transform-remove"
          onClick={(e) => setIsEditing(true)}
        >
          {editButtonText}
        </button>
      )}
      {children}
    </>
  );

  return (
    <Card native={true} state={state}>
      {({ x, ...props }) => (
        <animated.div
          className={classnames(
            'marapp-qa-inlineeditcard ng-padding-medium ng-inline-card ng-shadow-small ng-background-ultradkgray',
            {
              'ng-inline-card-editing': isEditing,
              'ng-inline-card-loading': isLoading,
            }
          )}
          style={{
            transform: x.interpolate((x) => `scale(${x})`),
            ...props,
          }}
        >
          {isEditing ? renderEditable() : renderDefault()}
          {isLoading && (
            <div className="ng-inline-card-spinner">
              <i className="ng-icon-spinner ng-icon-spin" />
            </div>
          )}
        </animated.div>
      )}
    </Card>
  );
}
