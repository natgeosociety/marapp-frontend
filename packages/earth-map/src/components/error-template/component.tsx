import React from 'react';

import './styles.scss';

interface IProps {
  type: string;
  message: string;
  children?: any;
  ctaDescription?: string;
}

const ErrorTemplate = (props: IProps) => (
  <div className="c-not-found">
    <div className="not-found--container">
      <div className="not-found--status">{props.type}</div>
      <div className="not-found--text">{props.message}</div>
      <div className="not-found--links">
        {props.ctaDescription && <div className="not-found--links--title">{props.ctaDescription}</div>}
        {props.children}
      </div>
    </div>
  </div>
);

export default ErrorTemplate;