/*
  Copyright 2018-2020 National Geographic Society

  Use of this software does not constitute endorsement by National Geographic
  Society (NGS). The NGS name and NGS logo may not be used for any purpose without
  written permission from NGS.

  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at

      https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed
  under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
  CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/


import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { createPortal } from 'react-dom';
import { animated, Keyframes } from 'react-spring/renderprops';

import './styles.scss';


const Overlay: any = Keyframes.Spring({
  close: { opacity: 0 },
  open: { opacity: 1},
});


const InlineCardOverlay = ( { show } ) => {

  const state = show ? 'open' : 'close';

  const mount = document.getElementById('page-wrapper');
  const el = document.createElement('div');

  useEffect(() => {
    mount.appendChild(el);
    return () => mount.removeChild(el);
  }, [el, mount]);


  return createPortal(<Overlay native state={state}>
    {( { x, ...props } ) => (
      <animated.div
        className={classnames(
          'ng-inline-card-overlay',
        )}
        style={{
          ...props,
        }}
      >
      </animated.div>
    )}
  </Overlay>, el);


};

export default InlineCardOverlay;
