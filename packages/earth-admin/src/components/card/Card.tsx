import * as React from 'react';

interface IProps {
  children: any;
  className?: string
}

export const Card = (props: IProps) => {
  const {
    children,
    className = '',
  } = props;

  return (
    <div className={`ng-padding-medium ng-background-ultradkgray ng-margin-medium-bottom ${className}`}>
      {props.children}
    </div>
  )
};