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
import { useContext, useEffect, useState } from 'react';
import { InlineCard, InlineCardDisplay, InlineCardEditable, InlineCardButtons } from 'components';

interface PlaceTitleProps {
  name?: string;
}

export default function PlaceTitle( props: PlaceTitleProps ) {
  const { name } = props;
  const [isEditing, setIsEditing] = useState(false);

  const editCard = ( editing ) => {
    setIsEditing(editing);
  };

  const saveCard = ( editing ) => {
    setIsEditing(editing);
  };

  return (
    <div className="ng-width-1-2">
      <InlineCard editAction={editCard} isEditing={isEditing} editable={true}>
        {!isEditing && <InlineCardDisplay>
          <h1 className="ng-text-display-m">{name}</h1>
        </InlineCardDisplay>}
        {isEditing && <><InlineCardEditable>
          <label className="ng-form-label" htmlFor="name">
            Place name*
          </label>
          <input
            name="name"
            type="text"
            defaultValue={name}
            placeholder="Place name"
            className="ng-width-1-1 ng-form-large"
          />
        </InlineCardEditable>
          <InlineCardButtons primaryButtonText="Save" secondaryButtonText="cancel" editAction={editCard}
                             saveAction={saveCard}/>
        </>
        }
      </InlineCard>
    </div>
  );
}
