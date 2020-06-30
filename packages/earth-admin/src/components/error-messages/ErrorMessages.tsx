import * as React from 'react';

import { ErrorMessageProps } from './model';

export default function ErrorMessages(props: ErrorMessageProps) {
  const { errors } = props;
  return (
    <div className="ng-form-error-block ng-margin-medium-bottom">
      {errors.map((error, index) => (
        <div key={index}>
          <span>{error.detail}</span>
        </div>
      ))}
    </div>
  );
}
