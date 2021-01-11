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

import classnames from 'classnames';
import { noop } from 'lodash';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import InputAdornment from '@material-ui/core/InputAdornment';
import makeStyles from '@material-ui/core/styles/makeStyles';
import IconMagnify from 'mdi-material-ui/Magnify';
import IconClose from 'mdi-material-ui/Close';

const useStyles = makeStyles((theme) => {
  console.log('theme: ', theme);
  return {
    root: {
      // @ts-ignore
      backgroundColor: theme.colors.gray7,
    },
  };
});

interface ISearchbox {
  value: string;
  placeholder: string;
  onChange: (e: any) => void;
  onReset: () => void;
  onFocus?: () => void;

  setIndexesSelected?: (value: any) => {};
  setPlace?: (value: any) => {};
  setMapBounds?: (value: any) => {};
  resetMap?: () => {};
  resetLayers?: () => {};
  resetPlace?: () => {};
  search?: any;
  open?: boolean;
  showClose?: boolean;
}

const SearchBox = (props: ISearchbox) => {
  const { value, placeholder, onChange = noop, onReset = noop, onFocus = noop, showClose } = props;
  const classes = useStyles();

  return (
    <Box className={classnames(classes.root, 'marapp-qa-searchbox')} p={2}>
      <TextField
        variant="outlined"
        fullWidth={true}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconMagnify fontSize="large" />
            </InputAdornment>
          ),
          endAdornment: showClose ? (
            <InputAdornment position="start">
              <IconButton onClick={onReset} size="small">
                <IconClose fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />
    </Box>
  );
};

export default SearchBox;
