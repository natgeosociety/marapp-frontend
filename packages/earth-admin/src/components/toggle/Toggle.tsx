import React from 'react';
import classNames from 'classnames';

import './styles.scss';

interface IProps {
  className?: string;
  active?: boolean;
}

const Toggle = (props: IProps) => {
  const { className, active } = props;
  const classes = classNames({
    '-active': active,
    'layers--item-switch': true,
    [className]: true,
  });

  return <div className={classes}><span /></div>
}

export default Toggle;
