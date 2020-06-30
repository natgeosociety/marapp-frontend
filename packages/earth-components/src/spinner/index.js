import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import './styles.scss';

const Spinner = (props) => {
  const { position, className, size="small" } = props;
  const classNames = classnames({
    'c-spinner': true,
    [`-${position}`]: true,
    [className]: !!className,
    [size]: !!size,
  });

  return (
    <div className={classNames}>
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
};

Spinner.propTypes = {
  position: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.string,
};

export default Spinner;