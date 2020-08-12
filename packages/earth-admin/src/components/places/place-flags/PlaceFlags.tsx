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

interface PlaceFlagsProps {
  published?: boolean;
  featured?: boolean;
}

export default function PlaceFlags( props: PlaceFlagsProps ) {
  const { published, featured } = props;
  const [isEditing, setIsEditing] = useState(false);

  const editCard = ( editing ) => {
    setIsEditing(editing);
  };

  const saveCard = ( editing ) => {
    setIsEditing(editing);
  };


  const publishIcon = published ? 'check' : 'close';
  const featuredIcon = featured ? 'check' : 'close';

  return (
    <div className="ng-width-1-2">
      <InlineCard editAction={editCard} isEditing={isEditing} editable={true}>
        {!isEditing && <InlineCardDisplay>
          <span className="ng-padding-horizontal">
            Published
            <br/>
            <i className={`ng-icon-${publishIcon}`}></i>
          </span>
          <span className="ng-padding-horizontal">
            Featured
            <br/>
            <i className={`ng-icon-${featuredIcon}`}></i>
          </span>
        </InlineCardDisplay>}
        {isEditing && <>
          <InlineCardEditable>
            <div>
              <input
                name="featured"
                id="featured"
                type="checkbox"
                defaultChecked={featured}
                className="ng-margin-right"
              />
              <label htmlFor="featured">Featured?</label>
            </div>
            <div>
              <input
                name="published"
                id="published"
                type="checkbox"
                defaultChecked={published}
                className="ng-margin-right"
              />
              <label htmlFor="published">Published?</label>
            </div>
          </InlineCardEditable>
        </>
        }
      </InlineCard>
    </div>
  );
}
