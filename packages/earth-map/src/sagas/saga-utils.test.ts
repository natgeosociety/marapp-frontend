/*
 * Copyright 2018-2020 National Geographic Society
 *
 * Use of this software does not constitute endorsement by National Geographic
 * Society (NGS). The NGS name and NGS logo may not be used for any purpose without
 * written permission from NGS.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 * this file except in compliance with the License. You may obtain a copy of the
 * License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

import { ignoreRedirectsTo } from './saga-utils';

describe('[saga-utils] ignoreRedirectsTo()', () => {
  const mockedAction = {
    type: 'OTHER_ACTION',
    meta: {
      location: {
        current: {
          type: 'CURRENT_ACTION',
          payload: {
            organization: 'ORG_A',
            slug: 'slug_X',
          },
        },
        prev: {
          type: 'PREV_ACTION',
          payload: {
            organization: 'ORG_A',
            slug: 'slug_X',
          },
        },
      },
    },
  };

  it('should ignore external actions', () => {
    const ignoreRedirectsToResource = ignoreRedirectsTo('ACTION_WE_CARE_ABOUT');
    expect(ignoreRedirectsToResource(mockedAction)).toBe(false);
  });

  it('should ignore same resource actions', () => {
    const ignoreRedirectsToResource = ignoreRedirectsTo('ACTION_WE_CARE_ABOUT');
    expect(ignoreRedirectsToResource(mockedAction)).toBe(false);
  });

  it('should ignore actions with the same type', () => {
    const ignoreRedirectsToResource = ignoreRedirectsTo('ACTION_WE_CARE_ABOUT');
    mockedAction.type = 'ACTION_WE_CARE_ABOUT';
    mockedAction.meta.location.current.type = 'SAME_ACTION';
    mockedAction.meta.location.prev.type = 'SAME_ACTION';
    expect(ignoreRedirectsToResource(mockedAction)).toBe(false);
  });

  it('should forward actions from different resources', () => {
    const ignoreRedirectsToResource = ignoreRedirectsTo('ACTION_WE_CARE_ABOUT');
    mockedAction.type = 'ACTION_WE_CARE_ABOUT';
    mockedAction.meta.location.current.payload.slug = 'slug_Y';
    expect(ignoreRedirectsToResource(mockedAction)).toBe(true);
  });

  it('should forward actions for the initial request', () => {
    const ignoreRedirectsToResource = ignoreRedirectsTo('ACTION_WE_CARE_ABOUT');
    mockedAction.meta.location.prev.type = '';
    expect(ignoreRedirectsToResource(mockedAction)).toBe(true);
  });
});
