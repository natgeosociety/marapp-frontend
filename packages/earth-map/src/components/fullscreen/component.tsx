import * as React from 'react';

import { Fullscreen } from '@marapp/earth-components';

interface IFullscreen {
  onClose: () => void;
}

class FullscreenComponent extends React.PureComponent<IFullscreen> {
  render() {
    return <Fullscreen {...this.props} />;
  }
}

export default FullscreenComponent;
