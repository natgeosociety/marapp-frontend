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

import { PureComponent } from 'react';
import { replace } from 'redux-first-router';

export interface IUrlProp {
  /**
   * Provides the type of value encoded in the URL
   */
  type: string;

  /**
   * The name of the field encoded in the url
   * e.q. "location" would be presented in the URL as ?location=some_value
   */
  value: string;

  /**
   * Selector for the redux store value that needs to be added in the URL
   */
  redux: string;

  /**
   * If set to true, and the value from 'redux' is undefined, this value won't be added in the URL
   */
  required: boolean;

  /**
   * Action dispatched once the URL value changes
   */
  action(payload?: any): any;

  /**
   * Optional - transform function that allows data modification before the value is added to the URL
   */
  mapValueToUrl?(reduxStoreValue: any): any;

  /**
   * Optional - transform function that modifies the received value from the url, before dispatching
   * the redux action
   */
  mapUrlToValue?(urlValue: any): any;
}

interface IUrl {
  router: {};
  url: string;
  urlProps: IUrlProp[];
  urlFromParams: {};
  paramsFromUrl: {};
}

/**
 * Dispatches actions based on with payload created from query params
 * TODO: Could be removed entirely if we find another way to apply side effects based on query params
 */
class UrlComponent extends PureComponent<IUrl, any> {
  public componentDidMount() {
    const { urlProps, paramsFromUrl } = this.props;

    urlProps.forEach((r) => {
      // @ts-ignore
      const action = this.props[r.action];
      const payload = paramsFromUrl[r.value];

      // Dispatch action
      action(payload);
    });
  }

  public componentDidUpdate(prevProps) {
    const { url } = this.props;
    const { url: prevUrl } = prevProps;

    if (url !== prevUrl) {
      // causes 'EARTH' and 'LOCATION' sagas to refetch if not ignored by `ignoreRedirectsTo()` function
      replace(url);
    }
  }

  public render() {
    return null;
  }
}

export default UrlComponent;
