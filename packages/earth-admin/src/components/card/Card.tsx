import * as React from 'react';

interface IProps {
  children: React.ReactNode;
  className?: string
}

export const Card = (props: IProps) => {
  const {
    children,
    className = '',
  } = props;

  return (
    <div className={`ng-padding-medium ng-background-ultradkgray ng-shadow-small  ${className}`}>
      {props.children}
    </div>
  )
};
