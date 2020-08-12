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

import { InlineCardProps } from '../InlineEditCard';

type InlineCardButtonsProps = Partial<InlineCardProps>;


const InlineCardButtons = ( props: Partial<InlineCardButtonsProps> ) => {
  const { primaryButtonText, secondaryButtonText, editAction, saveAction, validForm } = props;

  const handleEdit = () => {
    editAction(false);
  };

  const handleSave = () => {
    saveAction(false);
  };

  return (<div className="ng-margin-medium-top">
    {primaryButtonText && <button className="ng-button ng-button-primary ng-margin-right" disabled={!validForm}
                                  onClick={handleSave}>{primaryButtonText}</button>}
    {secondaryButtonText &&
    <button className="ng-button ng-button-secondary" onClick={handleEdit}>{secondaryButtonText}</button>}
  </div>);
};

export default InlineCardButtons;
