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

import classNames from 'classnames';
import React, { useState } from 'react';
import { Tooltip } from 'vizzuality-components';

import { downloadCSVFile, downloadJSONFile, useDomWatcher } from '@marapp/earth-shared';

import './styles.scss';

interface IMetric {
  data: { metric: {}; slug: string };
}

const WidgetDownload = (props: IMetric) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const {
    data: { metric, slug },
  } = props;

  const closeOnClickOutside = useDomWatcher(setShowDropdown, !showDropdown);

  const blobUrl = downloadJSONFile(metric);
  const csvBlobUrl = downloadCSVFile(metric);

  return (
    <div className="ng-position-relative marapp-qa-downloaddropdown" ref={closeOnClickOutside}>
      <Tooltip
        placement="top"
        overlay={<span>Download metric</span>}
        overlayClassName="c-rc-tooltip -default"
        mouseLeaveDelay={0}
      >
        <i
          className={classNames('ng-c-cursor-pointer ng-dropdown-button marapp-qa-actiondownload', {
            'ng-icon-angle-up ng-dropdown-button-open': showDropdown,
            'ng-icon-angle-down': !showDropdown,
          })}
          onClick={(e) => setShowDropdown(!showDropdown)}
        />
      </Tooltip>

      <div className={classNames('ng-ep-download-dropdown', { 'ng-display-block': showDropdown })}>
        <p className="ng-text-display-s ng-padding-medium-horizontal ng-padding-vertical ng-margin-remove">
          Download metric as a:
        </p>
        <ul className="marapp-qa-dropdown">
          <li>
            <a
              href={csvBlobUrl}
              download={`${slug}.csv`}
              className="ng-border-remove ng-display-block marapp-qa-actioncsv"
            >
              CSV
            </a>
          </li>
          <li>
            <a
              href={blobUrl}
              download={`${slug}.json`}
              className="ng-border-remove ng-display-block marapp-qa-actionjson"
            >
              JSON
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default WidgetDownload;
