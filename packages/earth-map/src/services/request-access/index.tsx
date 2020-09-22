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

const GOOGLE_FORM_ACTION =
  'https://docs.google.com/forms/d/e/1FAIpQLScte28qq7XwDBh11KUBlwskRP-Vng9X73AHjWL7k5VtDD-mjQ/formResponse';

// form entry names
const GOOGLE_FORM_USER_EMAIL = 'entry.816737307';
const GOOGLE_FORM_USER_NAME = 'entry.1301721177';
const GOOGLE_FORM_USER_ORG = 'entry.1570749264';

const GOOGLE_FORM_EAE = 'entry.870898483';
const GOOGLE_FORM_TERMS = 'entry.1348777197';

class RequestAccessService {
  public sendMessage(data) {
    const formData = new FormData();

    formData.append(GOOGLE_FORM_USER_EMAIL, data.userEmail);
    formData.append(GOOGLE_FORM_USER_NAME, data.userName);
    formData.append(GOOGLE_FORM_USER_ORG, data.userOrg);
    formData.append(GOOGLE_FORM_EAE, data.agreeEAE);
    formData.append(GOOGLE_FORM_TERMS, data.agreeTerms);

    // using default fetch API, axios does not suport no-cors mode
    return fetch(GOOGLE_FORM_ACTION, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
      },
      body: formData,
    }).catch((error) => {
      console.log('Request failure: ', error);
    });
  }
}

export const service = new RequestAccessService();

export default service;
