import React from 'react';

import './styles.scss';

interface IProps {
  fixedContent: React.ReactElement;
  children: React.ReactElement;
}

const SidebarLayoutSearch = (props: IProps) => (
  <>
    {props.fixedContent}
    <div className="scroll-container">{props.children}</div>
  </>
);

export default SidebarLayoutSearch;
