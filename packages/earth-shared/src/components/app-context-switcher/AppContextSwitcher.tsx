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

import React, { Children, cloneElement } from 'react';
import { noop } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconChevronDown from 'mdi-material-ui/ChevronDown';
import IconClose from 'mdi-material-ui/Close';
import Menu from '@material-ui/core/Menu';
import ToggleIcon from 'material-ui-toggle-icon';
import './styles.scss';

import { Option } from './Option';

interface IProps {
  label: string;
  logo?: React.ReactNode;
  value?: any;
  checkedCount?: number;
  renderDropdown?: boolean;
  children?: React.ReactChildren | Array<React.ReactChildren>;
  onChange?: () => {};
}

const useStyles = makeStyles((theme) => ({
  root: {
    // @ts-ignore
    backgroundColor: theme.colors.gray7,
  },
  menuRoot: {
    paddingLeft: '0px !important',
  },
}));

const AppContextSwitcher = (props: IProps) => {
  const {
    label,
    logo,
    value,
    checkedCount = 0,
    renderDropdown = true,
    children,
    onChange = noop,
  } = props;

  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const toggleDropdown = (event) => setAnchorEl(event.currentTarget);

  const closeDropdown = () => setAnchorEl(null);

  const isOpen = !!anchorEl;

  return (
    <Box className={classes.root} p={1} pb={0}>
      <Grid
        container={true}
        className="marapp-qa-context-switcher"
        justify="space-between"
        spacing={2}
      >
        <Grid item={true} className="marapp-qa-logo" onClick={closeDropdown}>
          {logo}
        </Grid>
        <Grid item={true}>
          {renderDropdown && (
            <>
              <Button
                onClick={toggleDropdown}
                endIcon={
                  <ToggleIcon on={isOpen} onIcon={<IconClose />} offIcon={<IconChevronDown />} />
                }
              >
                <Badge badgeContent={checkedCount} color="secondary" showZero={false}>
                  {label}
                </Badge>
              </Button>

              <Menu
                open={isOpen}
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                getContentAnchorEl={null}
                onClose={closeDropdown}
                className="marapp-qa-dropdown"
                classes={{
                  list: classes.menuRoot,
                }}
              >
                {Children.map(children, (child: any) => {
                  if (!child) {
                    return;
                  }
                  const isOptionElement = child.props.value;
                  const selected = child.props.value === value;
                  return isOptionElement
                    ? cloneElement(child, {
                        ...child.props,
                        selected,
                        onClick: (value: any) => {
                          if (!selected) {
                            onChange(value);
                          }
                          closeDropdown();
                        },
                      })
                    : child;
                })}
              </Menu>
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

// Child components
AppContextSwitcher.Option = Option;

export { AppContextSwitcher };
