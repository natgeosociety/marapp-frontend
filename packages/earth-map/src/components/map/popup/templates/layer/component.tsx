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

import makeStyles from '@material-ui/core/styles/makeStyles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { format } from 'd3-format';
import moment from 'moment';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 300,
  },
  layerSelect: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
  },
  table: {
    '& *': {
      wordBreak: 'break-all',
    },
    '& tr': {
      '&:last-child td': {
        borderBottomColor: 'transparent',
      },
      '& td': {
        verticalAlign: 'baseline',
        '&:nth-child(1)': {
          width: '40%',
          '& p': {
            fontWeight: 500,
          },
        },
        '&:nth-child(2)': {
          width: '60%',
        },
      },
    },
  },
  title: {
    position: 'relative',
  },
}));

interface ILayerPopupComponent {
  activeInteractiveLayer: any;
  activeInteractiveLayers: any;
}

const formatValue = (config, data) => {
  const { column, format: format_str, prefix, suffix, type } = config;
  let value = data[column];

  switch (type) {
    case 'date': {
      if (value && format_str) {
        value = moment(value).format(format_str);
      }

      break;
    }

    case 'number': {
      if (value && format_str) {
        value = format(format_str)(value);
      }

      break;
    }

    default: {
      value = data[column];
    }
  }

  return `${prefix} ${value} ${suffix}`;
};

const LayerPopupComponent = (props: ILayerPopupComponent) => {
  const { activeInteractiveLayer } = props;
  const classes = useStyles();

  const { name, data } = activeInteractiveLayer;
  const { interactionConfig } = activeInteractiveLayer.config || activeInteractiveLayer;
  const { output } = interactionConfig;

  return (
    <div className={classes.root}>
      <Typography variant="h6" className={classes.title} paragraph={true}>
        {name}
      </Typography>

      <TableContainer>
        <Table className={classes.table} size="small">
          <TableBody>
            {output
              .filter((o) => !o.hidden)
              .map((o) => {
                return (
                  <TableRow key={o.column}>
                    <TableCell align="right">
                      <Typography variant="body2">{o.property}:</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{formatValue(o, data.data)}</Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default LayerPopupComponent;
