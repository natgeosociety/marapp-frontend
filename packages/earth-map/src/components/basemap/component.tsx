import React from 'react';
import { APP_BASEMAPS } from '../../theme';
import { Layer } from '@marapp/earth-components';

import './styles.scss';

interface IBasemap {
  mapStyle: any;
  setMapStyle: any;
  persistData: any;
  basemap?: string;
  basemaps?: Array<{
    slug: string;
    name: string;
    background: string;
    id: string;
  }>;
}

class BasemapComponent extends React.PureComponent<IBasemap> {
  onBasemap = ({ id }) => {
    const { mapStyle, setMapStyle, persistData } = this.props;
    if (mapStyle !== id) {
      setMapStyle(id);
      persistData();
    }
  };

  render() {
    const { mapStyle } = this.props;

    return (
      <div className="layers--list">
        {APP_BASEMAPS.filter((l) => l.id !== mapStyle).map((basemap) => (
          <div key={basemap.id}>
            <Layer
              {...basemap}
              key={basemap.slug}
              onClick={() => {
                this.onBasemap(basemap);
              }}
            />
          </div>
        ))}
      </div>
    );
  }
}

export default BasemapComponent;
