import * as React from 'react';
import cn from 'classnames';

interface IProps {
  name: string;
  type?: string;
  label?: string;
  placeholder?: string;
  error?: string;
  size?: 'small' | 'large',
  className?: string;
  defaultValue?: string | number;
  [any: string]: any;
}

export const Input = React.forwardRef((props: IProps, ref: any) => {
  const {
    name,
    label,
    type = 'text',
    placeholder,
    error,
    size = 'large',
    className,
    defaultValue,
    ...rest
  } = props;

  const id = `input-${name}`;
  const rootClases = cn('marapp-qa-input input-component', {
    [className]: !!className,
    'ng-invalid-input': !!error,
  });
  const inputClases = cn({
    'ng-width-1-1': true,
    [`ng-form-${size}`]: true,
  })

  return (
    <div className={rootClases}>
      {label && <label className="ng-form-label ng-display-block" htmlFor={id}>{label}</label>}
      <input
        ref={ref}
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={inputClases}
        {...rest}
      />
      {error && (
        <div className="ng-form-error-block">{error}</div>
      )}
    </div>
  )
});
