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

import React, { PureComponent } from 'react';
import { ErrorMessages } from '@marapp/earth-shared';

interface IErrorBoundaryProps {
  fallbackComponent?: React.ReactNode;
}

interface IErrorBoundaryState {
  error?: any;
}

export class ErrorBoundary extends PureComponent<IErrorBoundaryProps, IErrorBoundaryState> {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  /* On re-render cycle, reset error and check if children still throw errors */
  UNSAFE_componentWillReceiveProps(nextProps: Readonly<IErrorBoundaryProps>, nextContext: any) {
    this.setState({ error: null });
  }

  render() {
    const { error } = this.state;
    const { children, fallbackComponent } = this.props;

    if (error) {
      return (
        fallbackComponent || (
          <ErrorMessages
            errors={[
              {
                detail: 'Unexpected error occurred',
              },
            ]}
          />
        )
      );
    }

    return children;
  }
}

export default ErrorBoundary;
