import classNames from 'classnames';
import React from 'react';

interface IProps {
  label: string;
  value: any;
  selected?: boolean;
  onClick?: (value: any) => void;
}

const Tabs = (props: IProps) => {
  const { label, selected, onClick, value } = props;

  return (
    <div
      onClick={() => onClick(value)}
      className={classNames('marapp-qa-tab ng-ep-tab', {
        'ng-ep-tab-selected': selected,
      })}
    >
      {label}
    </div>
  );
};

export default Tabs;
