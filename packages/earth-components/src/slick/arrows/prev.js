import React, { PureComponent } from "react";
import PropTypes from "prop-types";

class PrevArrow extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.shape({}),
    onClick: PropTypes.func,
  };

  static defaultProps = {
    className: "",
    style: {},
    onClick: null,
  };

  render() {
    const { className, style, onClick } = this.props;

    return (
      <div
        className={className}
        role="button"
        tabIndex="-1"
        style={{ ...style }}
        onClick={onClick}
      >
        <i className="ng-icon-directionleft" />
      </div>
    );
  }
}

export default PrevArrow;
