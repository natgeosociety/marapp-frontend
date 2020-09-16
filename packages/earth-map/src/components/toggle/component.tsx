import classNames from 'classnames';
import React from 'react';

import './styles.scss';

interface IProps {
  className?: string;
  active?: boolean;
}

const Toggle = (props: IProps) => {
  const { className, active } = props;
  const classes = classNames('marapp-qa-toggle layers--item-switch', {
    '-active': active,
    [className]: true,
  });

  return (
    <div className={classes}>
      <span />
    </div>
  );
};

export default Toggle;
