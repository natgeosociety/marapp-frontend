import { PureComponent } from 'react';
import { replace } from 'redux-first-router';

interface IUrl {
  router: {};
  url: string;
  urlProps: any;
  urlFromParams: {};
  paramsFromUrl: {};
}

class UrlComponent extends PureComponent<IUrl, any> {
  componentDidMount() {
    const { urlProps, paramsFromUrl } = this.props;

    urlProps.forEach(r => {
      const action = this.props[r.action];
      const payload = paramsFromUrl[r.value];

      // Dispatch action
      action(payload);
    });
  }

  componentDidUpdate(prevProps) {
    const { url } = this.props;
    const { url: prevUrl } = prevProps;

    if (url !== prevUrl) {
      // causes 'EARTH' and 'LOCATION' sagas to refetch if not ignored by `ignoreRedirectsTo()` function
      replace(url);
    }
  }

  render() {
    return null;
  }
}

export default UrlComponent;
