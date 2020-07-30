import React, { Children, cloneElement } from 'react';

import './styles.scss';

interface IProps {
  value: string;
  onChange: (value: any) => void;
  children: React.ReactElement | React.ReactElement[];
  className?: string;
}

const Tabs = (props: IProps) => {
  const { children, value, onChange, className } = props;
  const tabs = Children.map(children, (child, i) => cloneElement(child, {
    selected: value === child.props.value,
    onClick: onChange,
  }));

  return (
    <div className={`ng-ep-tabs ${className}`}>
      {tabs}
    </div>
  )
}

export default Tabs;