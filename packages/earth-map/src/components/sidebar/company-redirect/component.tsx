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

import React from 'react';

import { MAP_APP_NAME, MAP_COMPANY_URL } from '../../../config';
import './styles.scss';

const SidebarToggle = () => {
  return MAP_COMPANY_URL ? (
    <a
      href={MAP_COMPANY_URL}
      title={MAP_APP_NAME}
      className="marapp-qa-company-link company-link ng-flex ng-flex-center ng-flex-middle"
    >
      <i className="ng-body-color ng-icon-small ng-icon-home" />
    </a>
  ) : null;
};

export default SidebarToggle;
