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

import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import IconPlus from 'mdi-material-ui/Plus';
import IconMinus from 'mdi-material-ui/Minus';
import classnames from 'classnames';
import React from 'react';

import './styles.scss';

const styles = (theme) => ({
  root: {
    backgroundColor: theme.palette.grey['600'],
    '& button': {
      borderColor: 'transparent',
      minWidth: 0,
      padding: theme.spacing(0.5),
    },
  },
});

interface IZoomControl {
  viewport: { zoom?: number; maxZoom?: number; minZoom?: number };
  className?: string;
  onClick: (zoom: number) => void;
  classes?: any;
}

class ZoomControl extends React.PureComponent<IZoomControl, any> {
  public static propTypes = {};

  public static defaultProps = {
    className: null,
  };

  public increaseZoom = (e) => {
    e.stopPropagation();
    const { viewport, onClick } = this.props;
    const { zoom, maxZoom } = viewport;

    onClick(zoom === maxZoom ? zoom : zoom + 1);
  };

  public decreaseZoom = (e) => {
    e.stopPropagation();
    const { viewport, onClick } = this.props;
    const { zoom, minZoom } = viewport;

    onClick(zoom === minZoom ? zoom : zoom - 1);
  };

  public render() {
    const { classes, className, viewport } = this.props;
    const { zoom, maxZoom, minZoom } = viewport;

    const classNames = classnames('marapp-qa-zoomcontrol', classes.root, {
      [className]: !!className,
    });

    return (
      <ButtonGroup orientation="vertical" className={classNames}>
        <Button
          className="marapp-qa-zoomin"
          disabled={zoom === maxZoom}
          onClick={this.increaseZoom}
          size="small"
        >
          <IconPlus fontSize="small" />
        </Button>

        <Button
          className="marapp-qa-zoomout"
          disabled={zoom === minZoom}
          onClick={this.decreaseZoom}
          size="small"
        >
          <IconMinus fontSize="small" />
        </Button>
      </ButtonGroup>
    );
  }
}

export default withStyles(styles)(ZoomControl);
