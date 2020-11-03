import React from 'react';
import cn from 'classnames';

import './styles.scss';

interface IProps {
  children: React.ReactNode;
  elevation?: 'flush' | 'raised' | 'high';
  className?: string;
}

export const Card = (props: IProps) => {
  const { children, elevation = 'raised', className = '' } = props;
  const classNames = cn(`marapp-qa-card marapp-card ng-padding-medium `, {
    [`marapp-card-${elevation}`]: true,
    [className]: true,
  });

  return <div className={classNames}>{children}</div>;
};
