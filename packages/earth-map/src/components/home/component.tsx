import * as React from 'react';
import ReactFullpage from '@fullpage/react-fullpage';
// Components
import Globe from '../globe';

// Steps
import OutroStep from './steps/outro';

// styles
import './styles.scss';

class HomeComponent extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <div className="c-landing">
          <ReactFullpage
            licenseKey={process.env.REACT_APP_FULLPAGE_LICENSE}
            render={({ state, fullpageApi }) => {
              return (
                <ReactFullpage.Wrapper>
                  <div className="section landing--section">
                    <div className="landing-step">
                      <OutroStep active={true} fullpageApi={fullpageApi} />
                    </div>
                  </div>
                </ReactFullpage.Wrapper>
              );
            }}
          />

          <Globe visible={true} autoRotate={true} presentationMode={true} />
        </div>
      </React.Fragment>
    );
  }
}

export default HomeComponent;
