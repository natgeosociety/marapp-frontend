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

import IconButton from '@material-ui/core/IconButton';
import { bindTrigger, usePopupState } from 'material-ui-popup-state/hooks';
import IconDownload from 'mdi-material-ui/Download';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { downloadCSVFile, downloadJSONFile, Menu, useDomWatcher } from '@marapp/earth-shared';

import './styles.scss';

interface IMetric {
  data: { metric?: {}; slug?: string };
}

const WidgetDownload = (props: IMetric) => {
  const { t } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);
  const popupState = usePopupState({ variant: 'popover', popupId: 'download-actions' });
  const {
    data: { metric, slug },
  } = props;

  const closeOnClickOutside = useDomWatcher(setShowDropdown, !showDropdown);

  const blobUrl = downloadJSONFile(metric);
  const csvBlobUrl = downloadCSVFile(metric);

  if (!metric) {
    return null;
  }

  return (
    <div className="marapp-qa-downloaddropdown" ref={closeOnClickOutside}>
      <IconButton className="marapp-qa-actiondownload" {...bindTrigger(popupState)}>
        <IconDownload fontSize="small" />
      </IconButton>

      <Menu
        popupState={popupState}
        options={[
          {
            label: t('Download metric as a'),
            disabled: true,
          },
          {
            label: 'CSV',
            className: 'marapp-qa-actioncsv',
            component: 'a',
            href: csvBlobUrl,
            download: `${slug}.csv`,
          },
          {
            label: 'JSON',
            className: 'marapp-qa-actionjson',
            component: 'a',
            href: blobUrl,
            download: `${slug}.json`,
          },
        ]}
      />
    </div>
  );
};

export default WidgetDownload;
