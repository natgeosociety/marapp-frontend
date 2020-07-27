import {Sidebar} from 'components/sidebar';
import React from 'react';

const SidebarLayout = (props:any) => {

  return (<Sidebar>{props.children}</Sidebar>)
}


export default SidebarLayout;
