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

import React, { useEffect } from 'react';
import { replace } from 'redux-first-router'

import { Spinner } from '@marapp/earth-components';

import { changeEmailConfirmation } from 'services/users'

export default function ChangeEmailComponent() {

  useEffect(() => {
    (async () => {
      try {
        const hashParameter = window.location.hash;
        const hashQuery = hashParameter.split('#')[1];
        const params = new URLSearchParams(hashQuery)

        const accessToken = params.get('access_token')
        const error = params.get('error')
        const error_description = params.get('error_description')

        if (accessToken) {
          await changeEmailConfirmation({ accessToken })
        }
        if (error || error_description) {
          console.error(error, error_description)
        }
      } catch (e) {
        console.error(e);
      } finally {
        replace('/');
      }
    })();
  });

  return (
    <Spinner size="large" />
  )
}
