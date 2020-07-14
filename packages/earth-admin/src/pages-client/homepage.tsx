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
import { useEffect } from 'react';
import { navigate } from 'gatsby';

import { useAuth0 } from 'auth/auth0';

/**
 * Just redirect to the default selectedGroup. (set in auth0.tsx)
 */
const Homepage = () => {
  const { selectedGroup } = useAuth0();
  useEffect(() => {
    selectedGroup && navigate(`/${selectedGroup}`, { replace: true });
  }, [selectedGroup]);
  return <div>This is homepage - should be redirected to /:org</div>
}

export default Homepage;