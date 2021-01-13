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

import { createMuiTheme } from '@material-ui/core';

export default createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#FFFFFF',
    },
    secondary: {
      dark: '#006b70',
      main: '#0099A1',
      light: '#33adb3',
    },
    text: {
      primary: '#FFFFFF',
    },
    background: {
      default: '#212529',
      paper: '#343A40',
    },
    grey: {
      50: '#F8F9FA',
      100: '#E9ECEF',
      200: '#DEE2E6',
      300: '#CED4DA',
      400: '#ADB5BD',
      500: '#6C757D',
      600: '#495057',
      700: '#343A40',
      800: '#212529',
      900: '#212529',
      // A100: '#d5d5d5',
      // A200: '#aaaaaa',
      // A400: '#303030',
      // A700: '#616161',
    },
  },
  typography: {
    subtitle1: {
      textTransform: 'uppercase',
      fontWeight: 800,
      fontSize: 14,
      letterSpacing: 1.1,
    },
  },
  overrides: {
    MuiTab: {
      textColorPrimary: {
        '&$selected': {
          color: '#F8F9FA',
        },
      },
    },
    MuiOutlinedInput: {
      root: {
        backgroundColor: '#343a40',
      },
    },
    MuiChip: {
      root: {
        backgroundColor: '#F8F9FA',
        color: '#212529',
      },
    },
  },
  // @ts-ignore
  colors: {
    gray7: '#495057',
  },
});
