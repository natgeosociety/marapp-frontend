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

import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';
import React from 'react';

import { Html } from '@marapp/earth-shared';

interface IWidgetTemplateText {
  expanded: boolean;
  template?: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    transition: theme.transitions.create('margin-bottom', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  htmlContent: (props: IWidgetTemplateText) => ({
    ...theme.typography.body1,
    color: props.expanded ? theme.palette.text.primary : theme.palette.text.secondary,
    transition: theme.transitions.create('color', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const WidgetTemplateText = (props: IWidgetTemplateText) => {
  const { expanded, template } = props;
  const classes = useStyles({ expanded });

  return (
    <Box className={classes.root} mb={expanded ? 3 : 0}>
      <Html html={template} className={classes.htmlContent} />
    </Box>
  );
};

export default WidgetTemplateText;
