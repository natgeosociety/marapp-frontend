import * as React from 'react';

import { ErrorMessages } from 'components/error-messages';

export class ErrorBoundary extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
  }

  static getDerivedStateFromError(error) {
    return {
      error
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    const error = this.state.error;

    if (error) {
      return <ErrorMessages errors={[{
        title: error.message,
        detail: error.message,
      }]} />
    }

    return this.props.children;
  }
}