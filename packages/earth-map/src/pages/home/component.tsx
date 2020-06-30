import React from 'react';

import Home from 'components/home';

class HomePage extends React.PureComponent {
  render() {
    return (
      <div className="l-page">
        <div style={{ position: 'fixed', width: '80px', height: '100%', top: '0', left: '0' }} />
        <div className="l-content">
          <Home />
        </div>
      </div>
    );
  }
}

export default HomePage;
