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

import Button from '@material-ui/core/Button';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface IWidgetFooter {
  active: boolean;
  collapsed?: any;
  color?: any;
  onToggleLayer: (active: boolean) => {};
  onCollapse: (active: boolean) => {};
}

function WidgetFooterComponent(props: IWidgetFooter) {
  const { active, onToggleLayer } = props;
  const { t } = useTranslation();

  const toggleLayer = () => {
    onToggleLayer(active);
  };

  return (
    <footer className="marapp-qa-widgetfooter widget--footer">
      <Button
        variant={active ? 'contained' : 'outlined'}
        color={active ? 'secondary' : 'default'}
        onClick={toggleLayer}
        size="large"
      >
        {active ? t('Remove from map') : t('Show on map')}
      </Button>
    </footer>
  );
}

export default WidgetFooterComponent;
