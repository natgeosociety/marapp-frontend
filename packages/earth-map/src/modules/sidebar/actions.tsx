import { createAction } from 'vizzuality-redux-tools';

export const setSidebar = createAction('SIDEBAR/setSidebar');
export const setSidebarOpen = createAction('SIDEBAR/setSidebarOpen');
export const setSidebarPanel = createAction('SIDEBAR/setSidebarPanel');
export const setSidebarInfo = createAction('SIDEBAR/setSidebarInfo');
export const setSidebarLayers = createAction('SIDEBAR/setSidebarLayers');

export default { setSidebar, setSidebarOpen, setSidebarPanel, setSidebarInfo, setSidebarLayers };
