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

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import React from 'react';

export function WidgetSkeleton() {
  const titleWidth = Math.random() * 40 + 30;
  const itemWidth = Math.random() * 30;

  return (
    <Box p={2}>
      <Grid container={true} spacing={2}>
        <Grid item={true} xs={12}>
          <Box display="flex" alignItems="center">
            <Skeleton variant="text" animation="wave" width={`${itemWidth + 20}%`} height={24} />
            <Box px={1}>
              <Skeleton animation="wave" variant="circle" width={12} height={12} />
            </Box>
            <Skeleton animation="wave" variant="text" width={`${itemWidth + 10}%`} height={24} />
          </Box>
        </Grid>

        <Grid item={true} xs={12}>
          <Skeleton variant="text" animation="wave" width={`${titleWidth}%`} height={48} />
        </Grid>

        <Grid item={true} xs={12}>
          <Skeleton variant="rect" animation="wave" width="100%" height={180} />
        </Grid>
      </Grid>
    </Box>
  );
}
