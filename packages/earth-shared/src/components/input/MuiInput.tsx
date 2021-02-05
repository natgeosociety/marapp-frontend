import TextField from '@material-ui/core/TextField';
import cn from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface IProps {
  name: string;
  type?: string;
  label?: string;
  placeholder?: string;
  error?: string;
  size?: 'small' | 'large';
  className?: string;
  defaultValue?: string | number;
  required?: boolean;
  [any: string]: any;
}

export const MuiInput = React.forwardRef((props: IProps, ref: any) => {
  const {
    name,
    label,
    type = 'text',
    error,
    size = 'large',
    className,
    defaultValue,
    required,
    value,
    variant = 'outlined',
    ...rest
  } = props;
  const { t } = useTranslation('admin');
  const id = `input-${name}`;
  const rootClasses = cn('marapp-qa-input', {
    [className]: !!className,
  });

  return (
    <>
      <TextField
        className={rootClasses}
        defaultValue={value}
        error={!!error}
        fullWidth={true}
        helperText={error && t(error)}
        id={id}
        label={label && t(label)}
        name={name}
        required={!!required}
        type={type}
        variant={variant}
        FormHelperTextProps={{
          className: `marapp-qa-error marapp-qa-error-${id}`,
        }}
        {...rest}
      />
    </>
  );
});
