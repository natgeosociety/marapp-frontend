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

import MuiListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core/styles';
import IconCircleSmall from 'mdi-material-ui/CircleSmall';
import classnames from 'classnames';
import { noop } from 'lodash';
import React from 'react';
import Link from 'redux-first-router-link';

import { parseHintBold } from '../../utils';
import './style.scss';

const useStyles = makeStyles((theme) => ({
  root: (props: any) => {
    const rootStyles: any = {
      borderBottom: `1px solid ${theme.palette.divider}`,
      '&:last-child': {
        borderBottom: 'none',
      },
    };

    if (props?.showToggle) {
      rootStyles.paddingRight = theme.spacing(9);
    }

    return rootStyles;
  },
}));

interface IProps {
  title: string;
  key?: string;
  active?: boolean;
  linkTo?: {
    type: string;
    payload?: any;
  };
  organization?: string;
  hint?: string;
  list?: any[];
  labels?: string[];
  onClick?: () => void;
}

const ListItem = (props: IProps) => {
  const { title, hint, labels, organization, linkTo, onClick = noop, active } = props;
  const showToggle = typeof active !== 'undefined';
  const classes = useStyles({ ...props, showToggle });

  const listItemProps: any = {
    onClick,
    className: classnames(classes.root, 'marapp-qa-listitem'),
    component: linkTo ? Link : 'div',
    button: true,
  };

  if (linkTo) {
    listItemProps.to = linkTo;
  }

  return (
    <MuiListItem {...listItemProps}>
      <ListItemText
        primary={parseHintBold(hint || title)}
        secondary={
          <span>
            {organization && (
              <span key={`${organization}`}>
                {organization}
                <IconCircleSmall />
              </span>
            )}

            {labels?.length && <span>{labels.join(', ')}</span>}
          </span>
        }
        primaryTypographyProps={{ noWrap: true }}
        secondaryTypographyProps={{ noWrap: true }}
      />

      {showToggle && (
        <ListItemSecondaryAction onClick={onClick}>
          <Switch checked={active} />
        </ListItemSecondaryAction>
      )}
    </MuiListItem>
  );
};

export default ListItem;
