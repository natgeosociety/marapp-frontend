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
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import Link from 'redux-first-router-link';

import { MAP_APP_NAME } from '../../../../config';

export interface IOutro {
  active?: boolean;
  fullpageApi?: boolean;
}

const useStyles = makeStyles((theme) => ({
  root: {
    left: '50%',
    padding: theme.spacing(0, 2),
    pointerEvents: 'all',
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    '& *': {
      textAlign: 'center',
      textTransform: 'uppercase',
    },
  },
  subtitle: {
    fontWeight: 400,
    letterSpacing: 9,
    marginBottom: theme.spacing(2),
    textShadow: theme.shadows[1],
  },
  title: {
    fontWeight: 400,
    letterSpacing: 16,
    marginBottom: theme.spacing(6),
    // whiteSpace: 'nowrap'
  },
}));

const OutroComponent = (props: IOutro) => {
  const { active } = props;
  const classes = useStyles();

  return (
    <Fade
      in={active}
      timeout={{
        appear: 900,
      }}
    >
      <div className={classes.root}>
        <Typography variant="h6" className={classes.subtitle}>
          Start Exploring
        </Typography>
        <Typography variant="h2" className={classes.title}>
          {MAP_APP_NAME}
        </Typography>
        <Box display="flex" justifyContent="center">
          <Button
            className="marapp-qa-button"
            color="secondary"
            component={Link}
            size="large"
            to="/earth"
            variant="contained"
          >
            Launch
          </Button>
        </Box>
      </div>
    </Fade>
  );
};

export default OutroComponent;
