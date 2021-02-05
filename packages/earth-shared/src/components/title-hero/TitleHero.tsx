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

import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
  titleContainer: {
    overflow: 'hidden',
  },
  actions: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  finePrint: {
    display: 'block',
    marginBottom: 3,
  },
}));

interface IProps {
  extra: string;
  subtitle: string;
  title: string;
  actions?: React.ReactElement;
  finePrint?: string;
  className?: string;
}

export const TitleHero = ({
  extra,
  subtitle,
  title,
  actions,
  finePrint,
  className = ' ',
}: IProps) => {
  const classes = useStyles();

  return (
    <div className={`marapp-qa-titlehero ${classes.root} ${className}`}>
      <Typography variant="subtitle1" color="textPrimary" gutterBottom={true}>
        {subtitle} |{' '}
        <Typography component="span" variant="subtitle1" color="textPrimary">
          {extra}
        </Typography>
      </Typography>

      <Grid container={true} alignItems="flex-end" wrap="nowrap">
        <Grid item={true} xs={true} className={classes.titleContainer}>
          <Typography component="h2" variant="h4" color="textPrimary" noWrap={true}>
            {title}
          </Typography>
        </Grid>

        {!!finePrint && (
          <Grid item={true} xs={false}>
            <Typography variant="caption" color="textSecondary" className={classes.finePrint}>
              {finePrint}
            </Typography>
          </Grid>
        )}
      </Grid>

      {!!actions && <div className={classes.actions}>{actions}</div>}
    </div>
  );
};
