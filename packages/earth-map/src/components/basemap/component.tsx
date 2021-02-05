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

import ButtonBase from '@material-ui/core/ButtonBase';
import Paper from '@material-ui/core/Paper';
import makeStyles from '@material-ui/core/styles/makeStyles';
import React from 'react';

import { Layer } from '@marapp/earth-shared';

import { APP_BASEMAPS } from '../../theme';

interface IBasemap {
  mapStyle: any;
  setMapStyle: any;
  persistData: any;
  basemap?: string;
  basemaps?: Array<{
    slug: string;
    name: string;
    background: string;
    id: string;
  }>;
}

const useStyles = makeStyles((theme) => ({
  root: {
    '& .layers--item-bg': {
      border: 0,
      borderRadius: theme.shape.borderRadius,
      height: theme.spacing(10),
      width: theme.spacing(15),
      transition: theme.transitions.create('opacity', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      '&:hover': {
        opacity: 0.85,
      },
      '&:after': {
        display: 'none',
      },
    },
    '& .layers--item-title': {
      ...theme.typography.body1,
      fontWeight: 500,
      position: 'absolute',
      right: 0,
      left: 0,
      bottom: -9,
      marginBottom: theme.spacing(1),
      background: 'rgba(0, 0, 0, 0.5)',
      borderBottomLeftRadius: theme.shape.borderRadius,
      borderBottomRightRadius: theme.shape.borderRadius,
    },
  },
}));

const BasemapComponent = (props: IBasemap) => {
  const { mapStyle, persistData, setMapStyle } = props;
  const classes = useStyles();

  const onBasemap = ({ id }) => {
    if (mapStyle !== id) {
      setMapStyle(id);
      persistData();
    }
  };

  return (
    <ButtonBase>
      <div className={`${classes.root} marapp-qa-basemap`}>
        {APP_BASEMAPS.filter((l) => l.id !== mapStyle).map((basemap) => (
          <Paper elevation={3} key={basemap.id}>
            <Layer {...basemap} key={basemap.slug} onClick={() => onBasemap(basemap)} />
          </Paper>
        ))}
      </div>
    </ButtonBase>
  );
};

export default BasemapComponent;
