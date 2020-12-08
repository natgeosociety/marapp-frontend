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
import React, { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { animated, Keyframes } from 'react-spring/renderprops.cjs';

import { ErrorMessages } from '@marapp/earth-shared';

import { InlineCardOverlay } from './index';
import './styles.scss';
import { noop, isNil } from 'lodash';

interface IOptionsBag {
  isEditing: boolean;
  isLoading: boolean;
  serverErrors: any[];
  setIsEditing: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setServerErrors: (value: boolean) => void;
}

export interface InlineCardProps {
  // Pass children directly or use render props to have access to the edit state
  children: (optionsBag: IOptionsBag) => React.ReactNode | ReactNode;
  render?: (optionsBag: IOptionsBag) => React.ReactNode;
  hideEditButton?: boolean;
  editButtonText?: string;
  onSubmit?: (
    e: any,
    setIsEditing: (value: boolean) => void,
    setIsLoading: (value: boolean) => void,
    setServerErrors: (value: boolean) => void
  ) => void;
  onCancel?: () => void;
  submitButtonText?: string;
  cancelButtonText?: string;
  submitButtonVariant?: string;
  validForm?: boolean;
}

const Card: any = Keyframes.Spring({
  close: [{ x: 1 }],
  open: [{ x: 1.01 }, { x: 1 }],
});

export default function InlineEditCard(props: InlineCardProps) {
  const { t } = useTranslation();
  const {
    children,
    render,
    editButtonText = t('edit'),
    hideEditButton = false,
    onSubmit = noop,
    onCancel = noop,
    submitButtonText = t('Save'),
    cancelButtonText = t('Cancel'),
    submitButtonVariant,
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

    onCancel();
  };

  const renderEditable = () => (
    <>
      {render(optionsBag)}
      {serverErrors && <ErrorMessages errors={serverErrors} />}
      <InlineCardOverlay />
      <div className="ng-margin-medium-top">
        <button
          className={classnames(
            'marapp-qa-actionsaveinline ng-button ng-button-primary ng-margin-right',
            submitButtonVariant && `ng-button-${submitButtonVariant}`
          )}
          disabled={!validForm}
          onClick={(e) => onSubmit(e, setIsEditing, setIsLoading, setServerErrors)}
        >
          {submitButtonText}
        </button>
        <button
          type="button"
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
      {render && !hideEditButton && (
        <button
          type="button"
          className="marapp-qa-actioneditinline ng-button ng-button-link ng-edit-card-button ng-text-transform-remove"
          onClick={(e) => setIsEditing(true)}
        >
          {editButtonText}
        </button>
      )}
      {typeof children === 'function' ? children(optionsBag) : children}
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
