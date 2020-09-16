import React, { Children, cloneElement } from 'react';
import { noop } from 'utils';

import './styles.scss';

interface IProps {
  value: string;
  onChange: (value: any) => void;
  children: React.ReactElement | React.ReactElement[];
  className?: string;
}

const Tabs = (props: IProps) => {
  const { children, value, onChange, className } = props;
  const tabs = Children.map(children, (child) => {
    const selected = value === child.props.value;
    return cloneElement(child, {
      selected,
      onClick: selected // do nothing when clicking the selected tab multiple times
        ? noop
        : onChange,
    });
  });

  return <div className={`marapp-qa-tabs ng-ep-tabs ${className}`}>{tabs}</div>;
};

export default Tabs;
