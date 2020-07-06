import React from 'react';
import { Keyframes, animated } from 'react-spring';

import Places from 'components/places';
import Layers from 'components/layers';
import OrgSwitcher from 'components/org-switcher';

const LayersDropdown: any = Keyframes.Spring({
  close: { x: `-100vh`, delay: 0 },
  open: { x: '0vh', from: { x: '0vh' } },
});

const SidebarLayoutSearch = (props: any) => {
  const { layersPanel, children } = props;
  const state = layersPanel ? 'open' : 'close';

  return (
    <>
      <LayersDropdown native state={state}>
        {({ x, ...props }) => (
          <animated.div
            className="c-layers ng-section-background -active"
            style={{
              transform: x.interpolate((x) => `translate3d(0,${x},0)`),
              ...props,
            }}
          >
            <Layers />
          </animated.div>
        )}
      </LayersDropdown>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <OrgSwitcher />
        <div style={{ overflow: 'auto' }}>
          <Places />
          {children}
        </div>
      </div>
    </>
  )
};

export default SidebarLayoutSearch;