import * as React from "react";
import * as classNames from "classnames";
import PropTypes from "prop-types";

// todo: handle responsive exceptions, eg change placement if there is no space available
class Tooltip extends React.Component {
  static propTypes = {
    placement: PropTypes.string,
    children: PropTypes.node,
    trigger: PropTypes.node,
    animated: PropTypes.bool,
    contentClass: PropTypes.string,
    triggerClass: PropTypes.string,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    placement: "bottom",
    children: "Default tooltip content",
    trigger: "hover me!",
    animated: false,
    contentClass: "",
    triggerClass: "",
  };

  get content() {
    const { children } = this.props;
    if (children instanceof String) {
      return children.toString();
    } else {
      return children;
    }
  }

  // event handlers
  handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { onClose } = this.props;
    this.setState({ isOpen: false }, onClose);
  };

  handleOpen = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { onOpen } = this.props;
    this.setState({ isOpen: false }, onOpen);
  };

  render() {
    const { contentClass, triggerClass, placement, animated } = this.props;

    const CONTENT_CLASSES = classNames(
      {
        "ng-c-tooltip-content": true,
        animated: animated,
      },
      contentClass
    );

    const TRIGGER_CLASSES = classNames(
      {
        "ng-c-tooltip": true,
        [`tooltip-${placement}`]: true,
      },
      triggerClass
    );

    return (
      <div
        className={TRIGGER_CLASSES}
        onMouseEnter={(e) => this.handleOpen(e)}
        onMouseLeave={(e) => this.handleClose(e)}
      >
        {this.props.trigger}
        <div className={CONTENT_CLASSES}>{this.content}</div>
      </div>
    );
  }
}

export default Tooltip;
