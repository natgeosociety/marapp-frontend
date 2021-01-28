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

const COLORS = {
  SECONDARY_LIGHT: '#7ecace',
  // SECONDARY_MAIN: '#2CD787',
  // SECONDARY_DARK: '#2CD787',

  SECONDARY_MAIN: '#0099A1',
  SECONDARY_DARK: '#006b70',
  GREY_0: '#FFFFFF',
  GREY_1: '#F8F9FA',
  GREY_2: '#E9ECEF',
  GREY_3: '#DEE2E6',
  GREY_4: '#CED4DA',
  GREY_5: '#ADB5BD',
  GREY_6: '#6C757D',
  GREY_7: '#495057',
  GREY_8: '#343A40',
  GREY_9: '#212529',
};

const SPACING = 8;

export default createMuiTheme({
  spacing: SPACING,
  palette: {
    type: 'dark',
    primary: {
      light: COLORS.GREY_1,
      main: COLORS.GREY_2,
      dark: COLORS.GREY_3,
    },
    secondary: {
      light: COLORS.SECONDARY_LIGHT,
      main: COLORS.SECONDARY_MAIN,
      dark: COLORS.SECONDARY_DARK,
    },
    text: {
      primary: COLORS.GREY_0,
    },
    background: {
      default: COLORS.GREY_9,
      paper: COLORS.GREY_8,
    },
    grey: {
      50: COLORS.GREY_1,
      100: COLORS.GREY_2,
      200: COLORS.GREY_3,
      300: COLORS.GREY_4,
      400: COLORS.GREY_5,
      500: COLORS.GREY_6,
      600: COLORS.GREY_7,
      700: COLORS.GREY_8,
      800: COLORS.GREY_9,
      900: COLORS.GREY_9,
    },
  },
  typography: {
    h2: {
      textTransform: 'uppercase',
    },
    subtitle1: {
      fontWeight: 600,
      textTransform: 'capitalize',
    },
  },
  overrides: {
    MuiChip: {
      root: {
        backgroundColor: COLORS.GREY_1,
        color: COLORS.GREY_9,
      },
    },
    MuiFab: {
      root: {
        backgroundColor: COLORS.GREY_8,
        color: COLORS.GREY_1,
        '&:hover': {
          backgroundColor: COLORS.GREY_7,
        },
      },
    },
    MuiListItem: {
      gutters: {
        paddingLeft: SPACING * 2,
        paddingRight: SPACING * 2,
      },
    },
    MuiOutlinedInput: {
      root: {
        backgroundColor: COLORS.GREY_8,
      },
    },
    MuiTab: {
      textColorPrimary: {
        '&$selected': {
          color: COLORS.GREY_1,
        },
      },
    },
  },
});
