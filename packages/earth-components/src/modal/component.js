import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

// Components
import Modal from "react-modal";

// Styles
import "./styles.scss";

class ModalComponent extends PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    className: PropTypes.string,
    // Content
    children: PropTypes.node.isRequired,
    header: PropTypes.node,
    // Func
    onAfterOpen: PropTypes.func,
    onRequestClose: PropTypes.func.isRequired,
  };

  static defaultProps = {
    className: "",
    header: null,
    onAfterOpen: () => {},
  };

  render() {
    const {
      children,
      isOpen,
      className,
      header,
      onAfterOpen,
      onRequestClose,
    } = this.props;

    const classNames = classnames({
      [className]: !!className,
    });

    return (
      <Modal
        className={`c-modal ${classNames}`}
        overlayClassName="c-modal-overlay"
        bodyOpenClassName="-no-scroll"
        isOpen={isOpen}
        ariaHideApp={false}
        onAfterOpen={onAfterOpen}
        onRequestClose={onRequestClose}
      >
        {header}

        <button
          type="button"
          className="modal-close"
          onClick={(e) => e.stopPropagation() || onRequestClose()}
        >
          <i className="ng-icon-close" />
        </button>

        <div className="modal-content">{children}</div>
      </Modal>
    );
  }
}

export default ModalComponent;
