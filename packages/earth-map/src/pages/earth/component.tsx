import React from 'react';
import { Icons as VizzIcons } from 'vizzuality-components';

import Url from 'components/url';
import Map from 'components/map';
import Sidebar from 'components/sidebar';
import Place from 'components/place';
import Fullscreen from 'components/fullscreen';
import { URL_PROPS } from './url';
import SidebarLayoutSearch from 'components/sidebar/sidebar-layout-search';
import IndexSidebar from 'components/index-sidebar';

interface IEarth {
  setFullscreen?: (p: { data: {}; open: boolean }) => void;
  setMapInteractions?: (p: {}) => void;
  layersPanel?: boolean;
  selected?: string;
}

class EarthPage extends React.Component<IEarth> {
  render() {
    const { setFullscreen, setMapInteractions, selected } = this.props;

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

        <Sidebar>
          <SidebarLayoutSearch>
            {!!selected && <IndexSidebar />}
          </SidebarLayoutSearch>
        </Sidebar>

        <div className="l-content">
          <Map />
          <Place />
        </div>
      </main>
    );
  }
}

export default EarthPage;
