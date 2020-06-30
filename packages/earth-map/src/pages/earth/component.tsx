import React from 'react';

// Components
import { Icons as VizzIcons } from 'vizzuality-components';

import Url from 'components/url';

import Map from 'components/map';

import Sidebar from 'components/sidebar';
import SidebarPanel from 'components/sidebar-panel';

import Places from 'components/places';
import Place from 'components/place';

import IndexSidebar from 'components/index-sidebar';

import Fullscreen from 'components/fullscreen';

// URL props
import { URL_PROPS } from './url';
import { Keyframes, animated } from 'react-spring';
import Layers from 'components/layers';

interface IEarth {
  setFullscreen?: (p: { data: {}; open: boolean }) => void;
  setMapInteractions?: (p: {}) => void;
  layersPanel?: boolean;
  selected?: string;
}

const LayersDropdown: any = Keyframes.Spring({
  close: { x: -(window.innerHeight + 2), delay: 0 },
  open: { x: 0, from: { x: 0 } },
});

class EarthPage extends React.Component<IEarth> {
  render() {
    const { setFullscreen, setMapInteractions, layersPanel, selected } = this.props;

    const state = layersPanel ? 'open' : 'close';
    return (
      <main className="l-page" role="main">
        <VizzIcons />

        <Url type="EARTH" urlProps={URL_PROPS} />

        <Fullscreen
          onClose={() => {
            setFullscreen({ open: false, data: {} });
            setMapInteractions({});
          }}
        />

        <div className="l-sidebar">
          <Sidebar />

          <SidebarPanel>
            <LayersDropdown native state={state}>
              {({ x, ...props }) => (
                <animated.div
                  className="c-layers ng-section-background -active"
                  style={{
                    transform: x.interpolate((x) => `translate3d(0,${x}px,0)`),
                    ...props,
                  }}
                >
                  <Layers />
                </animated.div>
              )}
            </LayersDropdown>
            <Places />
            {!!selected && <IndexSidebar />}
          </SidebarPanel>
        </div>

        <div className="l-content">
          <Map />
          <Place />
        </div>
      </main>
    );
  }
}

export default EarthPage;
