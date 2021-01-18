/*
 * Copyright 2018-2020 National Geographic Society
 *
 * Use of this software does not constitute endorsement by National Geographic
 * Society (NGS). The NGS name and NGS logo may not be used for any purpose without
 * written permission from NGS.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 * this file except in compliance with the License. You may obtain a copy of the
 * License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Drawer from '@material-ui/core/SwipeableDrawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ToggleIcon from 'material-ui-toggle-icon';
import IconDown from 'mdi-material-ui/ChevronDown';
import IconUp from 'mdi-material-ui/ChevronUp';
import IconCircleSmall from 'mdi-material-ui/CircleSmall';

const useStyles = makeStyles((theme) => {
  return {
    root: {
      maxHeight: 'calc(100vh - 180px)',
      backgroundColor: theme.palette.background.default,
    },
    content: {
      overflowY: 'scroll',
    },
  };
});

interface IProps {
  children: any;
  title: string;
  subtitle?: string;
  extra?: string;
  onClose: () => void;
}

export function ExpansionContent(props: IProps) {
  const { children, title, subtitle, extra, onClose } = props;
  const [opened, setOpened] = useState(false);
  const classes = useStyles();

  const listItemProps: any = {
    primary: title,
    primaryTypographyProps: { variant: 'subtitle1', noWrap: true },
    secondaryTypographyProps: { noWrap: true },
  };

  if (subtitle) {
    listItemProps.secondary = (
      <span>
        <span>{subtitle}</span>

        {extra && (
          <span>
            <IconCircleSmall /> {extra}
          </span>
        )}
      </span>
    );
  }

  return (
    <Drawer
      open={true}
      variant={opened ? 'temporary' : 'permanent'}
      anchor="bottom"
      onOpen={() => setOpened(true)}
      onClose={onClose}
    >
      <Box className={classes.root} display="flex" flexDirection="column">
        <Paper elevation={8} square={true}>
          <List onClick={() => setOpened(!opened)}>
            <ListItem>
              <ListItemText {...listItemProps} />

              <ListItemSecondaryAction>
                <IconButton>
                  <ToggleIcon on={opened} onIcon={<IconDown />} offIcon={<IconUp />} />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>

        {opened ? (
          <Box flex={1} className={classes.content}>
            {children}
          </Box>
        ) : null}
      </Box>
    </Drawer>
  );
}
