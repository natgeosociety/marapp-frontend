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

import withStyles from '@material-ui/core/styles/withStyles';

import classnames from 'classnames';

import renderHTML from 'react-render-html';

// Styles
import './styles.scss';

const styles = (theme) => ({
  root: {
    '& h1': {
      ...theme.typography.h1,
    },
    '& h2': {
      ...theme.typography.h2,
    },
    '& h3': {
      ...theme.typography.h3,
    },
    '& h4': {
      ...theme.typography.h4,
    },
    '& h5': {
      ...theme.typography.h5,
    },
    '& h6': {
      ...theme.typography.h6,
    },
    '& p': {
      ...theme.typography.body1,
    },
  },
});

interface HTMLProps {
  html: string;
  classes?: any;
  className?: string;
}

class HTML extends React.Component<HTMLProps> {
  static defaultProps = {
    className: '',
  };

  render() {
    const { classes, html, className } = this.props;

    return (
      <div
        className={classnames('marapp-qa-html', 'c-html', classes.root, {
          [className]: !!className,
        })}
      >
        {renderHTML(html)}
      </div>
    );
  }
}

export default withStyles(styles)(HTML);
