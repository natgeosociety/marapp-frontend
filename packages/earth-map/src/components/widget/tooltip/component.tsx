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
import React from 'react';

interface TooltipProps {
  payload?: any[];
  settings?: any;
  style?: {};
  hideZeros?: boolean;
}

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: theme.shadows[4],
    backgroundColor: theme.palette.grey['600'],
    padding: theme.spacing(1, 2),
    color: theme.palette.text.primary,
    borderRadius: theme.shape.borderRadius,
    ...theme.typography.body2,
  },
  dataLine: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    '&.right': {
      textAlign: 'right',
      justifyContent: 'flex-end',
    },
  },
  dataLabel: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginRight: theme.spacing(2),
  },
  breakLabel: {
    ...theme.typography.body2,
    fontStyle: 'italic',
    flexDirection: 'row',
    paddingBottom: theme.spacing(0.5),
    paddingTop: theme.spacing(0.5),
  },
  dataColor: {
    height: theme.spacing(1.5),
    width: theme.spacing(1.5),
    minHeight: theme.spacing(1.5),
    minWidth: theme.spacing(1.5),
    borderRadius: theme.shape.borderRadius,
    marginRight: theme.spacing(0.5),
    marginTop: theme.spacing(0.5),
  },
}));

const Tooltip = (props: TooltipProps) => {
  const { payload = [], style = {}, hideZeros = false, settings } = props;

  const classes = useStyles();

  const getValue = (item, value) => {
    const { format, suffix = '', preffix = '' } = item;
    let val = value;

    if (format && typeof format === 'function') {
      val = format(val);
    }

    return `${preffix}${val}${suffix}`;
  };

  const values = payload && payload.length > 0 && payload[0].payload;

  return (
    <div>
      {settings && settings.length && (
        <div className={`${classes.root} marapp-qa-widgettooltip`} style={style}>
          {settings.map((d: any) =>
            hideZeros && !values[d.key] ? null : (
              <div key={d.key} className={`${classes.dataLine} ${d.position || ''}`}>
                {/* LABEL */}
                {(d.label || d.labelKey) && (
                  <div className={classes.dataLabel}>
                    {d.color && (
                      <div className={classes.dataColor} style={{ backgroundColor: d.color }} />
                    )}

                    {d.key === 'break' ? (
                      <span className={classes.breakLabel}>{d.label}</span>
                    ) : (
                      <span>{d.label || values[d.labelKey]}</span>
                    )}
                  </div>
                )}

                {/* UNIT */}
                <div className="data-value">{getValue(d, values[d.key])}</div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
