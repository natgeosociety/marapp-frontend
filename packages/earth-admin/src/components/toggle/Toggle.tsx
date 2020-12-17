import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';

import './styles.scss';

interface IProps {
  value: boolean;
  label: string;
  name: string;
  onChange: (e) => {};
  className?: string;
}

export const Toggle = React.forwardRef((props: IProps, ref: any) => {
  const { className, value, label, onChange, name } = props;
  const { t } = useTranslation('admin');

  const classes = classNames({
    '-active': value === true,
    'layers--item-switch ng-margin-right': true,
    [className]: true,
  });

  const handleClick = (e) => {
    onChange(e);
  };

  return (
    <label
      htmlFor={name}
      className="marapp-qa-toggle ng-c-cursor-pointer ng-flex ng-text-weight-regular"
    >
      <span className={classes}>
        <input
          onClick={handleClick}
          ref={ref}
          id={name}
          name={name}
          checked={value}
          type="checkbox"
          readOnly={true}
        />
        <span />
      </span>
      {t(label)}
    </label>
  );
});
