import * as React from 'react';
import cn from 'classnames';

import './styles.scss';

interface IProps {
  name: string;
  type?: string;
  label?: string;
  placeholder?: string;
  error?: string;
  size?: 'small' | 'medium' | 'large',
  className?: string;
}

export const Input = React.forwardRef((props: IProps, ref: any) => {
  const {
    name,
    label,
    type = 'text',
    placeholder,
    error,
    size = 'medium',
    className,
  } = props;

  const id = `input-${name}`;
  const rootClases = cn({
    'input-component': true,
    [className]: !!className,
  });
  const inputClases = cn({
    [`ng-form-${size}`]: true,
  })

  return (
    <div className={rootClases}>
      {label && <label className="ng-form-label" htmlFor="input-name">{label}</label>}
      <input
        ref={ref}
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        className={inputClases}
      />
      {error && (
        <span className="error">{error}</span>
      )}
    </div>
  )
});