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

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface IProps {
  onRefresh: (payload?: any) => void;
  onOverwrite: (payload?: any) => void;
}

const useStyles = makeStyles((theme) => ({
  dialogActions: {
    marginTop: theme.spacing(2),
    justifyContent: 'center',
  },
}));

export function CollectionConflict(props: IProps) {
  const { onOverwrite, onRefresh } = props;
  const [isOverwriting, setIsOverwriting] = useState(false);
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Dialog open={true} className="marapp-qa-DeleteConfirmation" maxWidth="sm" fullWidth={true}>
      <DialogTitle disableTypography={true}>
        <Typography variant="h5" align="center">
          {t('Update warning')}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Typography align="center">
          {t(
            'An update to this collection was made while you were in edit mode. Saving your edits will overide any other updates that were made to the collection. Please refresh this page to view updates made by others, or continue saving.'
          )}
        </Typography>
      </DialogContent>

      <DialogActions className={classes.dialogActions}>
        <Button
          className="marapp-qa-actionrefresh "
          size="large"
          variant="contained"
          color="secondary"
          onClick={onRefresh}
        >
          {t('Refresh')}
        </Button>

        <Button
          tabIndex={0}
          className="marapp-qa-actionsaveanyway"
          onClick={() => {
            setIsOverwriting(true);
            onOverwrite();
          }}
          disabled={isOverwriting}
          endIcon={isOverwriting && <CircularProgress size={16} />}
          size="large"
          variant="outlined"
        >
          {isOverwriting ? t('Saving') : t('Save anyway')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
