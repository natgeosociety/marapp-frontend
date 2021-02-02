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
import Collapse from '@material-ui/core/Collapse';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ToggleIcon from 'material-ui-toggle-icon';
import IconRemoveLayer from 'mdi-material-ui/LayersOffOutline';
import IconAddLayer from 'mdi-material-ui/LayersPlus';
import React from 'react';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  root: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));

interface IWidgetFooter {
  active: boolean;
  expanded?: any;
  onToggleLayer: (active: boolean) => {};
}

function WidgetFooterComponent(props: IWidgetFooter) {
  const { active, expanded, onToggleLayer } = props;
  const { t } = useTranslation();
  const classes = useStyles();

  const toggleLayer = () => {
    onToggleLayer(active);
  };

  return (
    <Collapse in={expanded}>
      <footer className="marapp-qa-widgetfooter widget--footer">
        <Button
          variant={active ? 'contained' : 'outlined'}
          color={active ? 'secondary' : 'default'}
          className={classes.root}
          onClick={toggleLayer}
          size="large"
          endIcon={
            <ToggleIcon
              on={active}
              onIcon={<IconRemoveLayer fontSize="small" />}
              offIcon={<IconAddLayer fontSize="small" />}
            />
          }
        >
          {t(active ? 'Remove from map' : 'Show on map')}
        </Button>
      </footer>
    </Collapse>
  );
}

export default WidgetFooterComponent;
