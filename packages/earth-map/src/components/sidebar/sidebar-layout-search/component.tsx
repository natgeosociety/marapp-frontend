import Header from 'components/header';
import { Tab, Tabs } from 'components/tabs';
import React from 'react';

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
      <Tabs
        value={props.panel}
        onChange={props.setSidebarPanel}
        className="ng-padding-medium-horizontal ng-padding-bottom ng-ep-background-dark"
      >
        <Tab label="Places" value="places" />
        <Tab label="Layers" value="layers" />
      </Tabs>
      {props.fixedContent}
    </div>
    {props.children}
  </div>
);

export default SidebarLayoutSearch;
