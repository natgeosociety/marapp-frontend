import React from 'react';
import PropTypes from 'prop-types';

import ReactMarkdown from 'react-markdown';

// Styles
import './styles.scss';

class Markdown extends React.Component {
  static propTypes = {
    source: PropTypes.string.isRequired
  };

  render() {
    return (
      <div className="c-markdown">
        <ReactMarkdown {...this.props} />
      </div>
    );
  }
}

export default Markdown;
