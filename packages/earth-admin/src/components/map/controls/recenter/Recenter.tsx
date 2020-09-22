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

import classnames from 'classnames';
import React from 'react';

import './styles.scss';

export interface IRecenter {
  className?: string;
  onClick: () => void;
}

class RecenterControl extends React.PureComponent<IRecenter> {
  public static defaultProps = {
    className: null,
  };

  public render() {
    const { className, onClick } = this.props;

    const classNames = classnames('marapp-qa-maprecenter c-recenter-control', {
      [className]: !!className,
    });

    return (
      <div className={classNames}>
        <button type="button" className="recenter-control--btn" onClick={onClick}>
          <i className="ng-body-color ng-icon-geolocate" />
        </button>
      </div>
    );
  }
}

export default RecenterControl;
