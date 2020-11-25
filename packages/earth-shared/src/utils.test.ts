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

import { getGenericDate } from './utils';

describe('utils', () => {
  test('getGenericDate() should return date in YYYY-MM-DD format', () => {
    const on20201119 = '2020-11-19T10:24:09.735Z';
    const on20201017 = '2020-10-17T18:19:09.059Z';

    expect(getGenericDate(on20201119)).toEqual('2020-11-19');
    expect(getGenericDate(on20201017)).toEqual('2020-10-17');
  });
});
