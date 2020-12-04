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

import React, { useContext } from 'react';
import { Provider } from 'react-redux';

import { Spinner, TranslationService } from '@marapp/earth-shared';

import { Auth0Context, useAuth0 } from './auth/auth0';
import Main from './pages/main';
import initStore from './store';

TranslationService.init();

const App = () => {
  const { isLoading } = useAuth0();
  const { selectedGroup } = useContext(Auth0Context);

  const initialState = {
    user: {
      group: selectedGroup,
    },
  };

  if (!isLoading) {
    // TODO: move initStore outside of render
    const { store } = initStore(initialState);

    return (
      // @ts-ignore
      <Provider store={store}>
        <Main />
      </Provider>
    );
  }

  return <Spinner size="large" />;
};

export default App;
