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
import Typography from '@material-ui/core/Typography';

import './styles.scss';

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
}: IProps) => (
  <div className={`marapp-qa-titlehero title-hero ${className}`}>
    <Typography variant="subtitle1" color="textPrimary" gutterBottom={true}>
      {subtitle} |{' '}
      <Typography component="span" variant="subtitle1" color="textSecondary">
        {extra}
      </Typography>
    </Typography>
    <Typography variant="h5" component="h2" color="textPrimary" noWrap={true}>
      {title}
    </Typography>
    {!!actions && <div className="title-hero-actions">{actions}</div>}
    {!!finePrint && (
      <div className="title-hero-fineprint ng-text-small ng-width-1-4">{finePrint}</div>
    )}
  </div>
);
