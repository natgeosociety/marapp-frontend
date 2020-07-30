import React from 'react';

import Header from 'components/header';
import { Tabs, Tab } from 'components/tabs';

import './styles.scss';

interface IProps {
  fixedContent: React.ReactElement;
  children: React.ReactElement;
  panel: string;
  setSidebarPanel: (value: any) => void;
}

const SidebarLayoutSearch = (props: IProps) => (
  <div style={{ height: '100%', overflow: 'auto' }}>
    <div className="ng-sticky-top ng-margin-bottom">
      <Header />
      <Tabs className="ng-padding-medium-horizontal ng-padding-bottom ng-ep-background-dark" value={props.panel} onChange={props.setSidebarPanel}>
        <Tab label="Places" value="places" />
        <Tab label="Layers" value="layers" />
      </Tabs>
      {props.fixedContent}
    </div>
    {props.children}
  </div>
);

export default SidebarLayoutSearch;