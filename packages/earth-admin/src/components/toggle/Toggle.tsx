import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import './styles.scss';

interface IProps {
  className?: string;
  value?: boolean;
  label?: string
  onChange?: (e) => {};
}

export const Toggle = React.forwardRef((props: any, ref: any) => {
  const {className, value, label, onChange, name, checked, ceva} = props;

  const classes = classNames({
    '-active': value === true,
    'layers--item-switch ng-margin-right': true,
    [className]: true,
  });

  const handleClick = (e) => {
    onChange(e);
  };

  return (
    <label htmlFor={name} className="ng-c-cursor-pointer ng-flex">
      <span className={classes}>
        <input
          onClick={handleClick}
          ref={ref}
          id={name}
          name={name}
          checked={value}
          type='checkbox'
          readOnly
        />
        <span/>
      </span>
      {label}
    </label>);
});

