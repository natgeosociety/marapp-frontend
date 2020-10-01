import React from 'react';
import classnames from 'classnames';

interface IProps {
  value: any;
  selected: boolean;
  onClick: (value: any) => {};
  children?: any;
}

export const Option = (props: IProps) => {
  const { value, selected, onClick, children } = props;

  return (
    <li
      title={children}
      className={classnames('ng-option ng-text-display-s ng-padding-medium-horizontal', {
        selected: selected,
      })}
      onClick={() => onClick(value)}
    >
      {children}
    </li>
  );
};
