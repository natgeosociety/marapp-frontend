import React, { useEffect, useState } from 'react';

import { createPortal } from 'react-dom';
import { animated, Keyframes } from 'react-spring/renderprops';

import { InlineCardProps } from '../InlineCard';

type InlineCardOverlayProps = { show: boolean }

import './styles.scss';
import classnames from 'classnames';

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
