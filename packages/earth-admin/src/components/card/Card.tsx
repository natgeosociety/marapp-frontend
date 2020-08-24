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
    <div className={`ng-padding-medium ng-background-ultradkgray ng-height-1-1 ${className}`}>
      {props.children}
    </div>
  )
};
