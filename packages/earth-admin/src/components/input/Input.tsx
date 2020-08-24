import * as React from 'react';
import cn from 'classnames';

// import './styles.scss';

interface IProps {
  name: string;
  type?: string;
  label?: string;
  placeholder?: string;
  error?: string;
  size?: 'small' | 'large',
  className?: string;
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
    ...rest
  } = props;

  const id = `input-${name}`;
  const rootClases = cn({
    'input-component': true,
    [className]: !!className,
    'ng-invalid-input': !!error,
  });
  const inputClases = cn({
    'ng-width-1-1': true,
    [`ng-form-${size}`]: true,
  })

  return (
    <div className={rootClases}>
      {label && <label className="ng-form-label ng-display-block" htmlFor="input-name">{label}</label>}
      <input
        ref={ref}
        id={id}
        name={name}
        type={type}
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