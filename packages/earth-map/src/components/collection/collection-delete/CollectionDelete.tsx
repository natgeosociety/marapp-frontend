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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ICollection } from '../../../modules/collections/model';
import { EPanels } from '../../../modules/sidebar/model';
import PlacesService from '../../../services/PlacesService';

interface IProps {
  collection: ICollection;
  isDeleting: boolean;
  setIsDeleting: (value: boolean) => void;
  dispatch?: (p: any) => void;
}

const useStyles = makeStyles((theme) => ({
  dialogActions: {
    marginTop: theme.spacing(2),
    justifyContent: 'center',
  },
}));

export function CollectionDelete(props: IProps) {
  const [saveError, setSaveError] = useState('');
  const { collection, isDeleting, setIsDeleting, dispatch } = props;
  const { t } = useTranslation();
  const { id, organization, name } = collection;
  const classes = useStyles();

  return (
    <Dialog
      open={isDeleting}
      className="marapp-qa-deleteConfirmation"
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogTitle disableTypography={true}>
        <Typography variant="h5" align="center">
          {t('Delete')} {name}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Typography align="center" paragraph={true}>
          {t('Are you sure you want to permanently delete this collection')}?
        </Typography>

        {saveError && (
          <Typography color="error" align="center">
            {saveError}
          </Typography>
        )}
      </DialogContent>

      <DialogActions className={classes.dialogActions}>
        <Button
          autoFocus={true}
          tabIndex={0}
          className="marapp-qa-actioncancel"
          onClick={() => setIsDeleting(false)}
          size="large"
        >
          {t('Cancel')}
        </Button>

        <Button
          className="marapp-qa-actiondelete"
          size="large"
          variant="contained"
          color="secondary"
          onClick={handleDelete}
        >
          {t('Delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );

  async function handleDelete() {
    try {
      await PlacesService.deletePlace(id, { group: organization });

      dispatch({
        type: 'EARTH',
      });
      dispatch({
        type: 'GLOBAL/setLastViewedPlace',
        payload: null,
      });
      // TODO: move all the following side effects under the `EARTH` action
      // also find out why actions only work with dispatch()
      dispatch({
        type: 'COLLECTIONS/resetCollection',
      });
      dispatch({
        type: 'PLACES/setPlacesSearch',
        payload: {
          search: '',
        },
      });
      dispatch({
        type: 'LAYERS/setLayersSearch',
        payload: {
          search: '',
        },
      });
      dispatch({
        type: 'LAYERS/resetLayers',
      });
      dispatch({
        type: 'SIDEBAR/setSidebarPanel',
        payload: EPanels.PLACES,
      });
      dispatch({
        type: 'MAP/resetMap',
      });
    } catch (e) {
      setSaveError('Something went wrong');
      console.log(e);
    }
  }
}
