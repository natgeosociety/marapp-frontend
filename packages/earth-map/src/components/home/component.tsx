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

import ReactFullpage from '@fullpage/react-fullpage';
import { FULLPAGE_LICENSE } from 'config';
import React from 'react';

// Components
import Globe from '../globe';

import OutroStep from './steps/outro';
import './styles.scss';

// Steps

// styles

class HomeComponent extends React.PureComponent {
  public render() {
    return (
      <React.Fragment>
        <div className="c-landing marapp-qa-home">
          <ReactFullpage
            licenseKey={FULLPAGE_LICENSE}
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
