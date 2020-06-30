import React from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';

import renderHTML from 'react-render-html';

// Styles
import './styles.scss';

class HTML extends React.Component {
  static propTypes = {
    html: PropTypes.string.isRequired,
    className: PropTypes.string
  };

  static defaultProps = {
    className: ''
  }

  render() {
    const { html, className } = this.props;

    return (
      <div
        className={classnames({
          "c-html": true,
          [className]: !!className
        })
      }>
        {renderHTML(html)}
      </div>
    );
  }
}

export default HTML;
