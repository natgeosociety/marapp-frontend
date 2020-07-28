import React from 'react';

import Header from 'components/header';

import './styles.scss';

interface IProps {
  fixedContent: React.ReactElement;
  children: React.ReactElement;
  setSidebarPanel: (value: any) => void;
}

const SidebarLayoutSearch = (props: IProps) => (
  <div style={{ height: '100%', overflow: 'auto' }}>
    <div className="ng-sticky-top ng-margin-bottom">
      <Header />
      <div>
        <span onClick={() => props.setSidebarPanel('places')}>Places</span>
        <span onClick={() => props.setSidebarPanel('layers')}>Layers</span>
      </div>
      {props.fixedContent}
    </div>
    {props.children}
  </div>
);

export default SidebarLayoutSearch;