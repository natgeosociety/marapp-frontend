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
import './styles.scss';

//@ts-ignore
new Auth0ChangePassword({
  container: 'change-password-widget-container', // required
  email: '{{email | escape}}', // DO NOT CHANGE THIS
  csrf_token: '{{csrf_token}}', // DO NOT CHANGE THIS
  ticket: '{{ticket}}', // DO NOT CHANGE THIS
  password_policy: '{{password_policy}}', // DO NOT CHANGE THIS
  password_complexity_options: '{{password_complexity_options}}', // DO NOT CHANGE THIS
  theme: {
    icon: "{{tenant.picture_url | default: '//cdn.auth0.com/styleguide/1.0.0/img/badge.png'}}",
    primaryColor: "{{tenant.colors.primary | default: '#ea5323'}}",
  },
  dict: {
    passwordPlaceholder: 'enter password',
    passwordConfirmationPlaceholder: 're-enter password',
    successMessage:
      'You have successfully changed your password. You may now sign in with your new password.',
    headerText: 'Create new password',
    title: 'Change Password',
  },
});
