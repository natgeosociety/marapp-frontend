import { createAction } from 'vizzuality-redux-tools';

export const setFullscreen = createAction('SIDEBAR/setFullscreen');
export const setFullscreenOpen = createAction('SIDEBAR/setFullscreenOpen');
export const setFullscreenData = createAction('SIDEBAR/setFullscreenData');

export default { setFullscreen, setFullscreenOpen, setFullscreenData };
