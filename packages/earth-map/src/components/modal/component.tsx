import React, { PureComponent } from 'react';
import classnames from 'classnames';

// Components
import Modal from 'react-modal';

// Styles
import './styles.scss';

interface IModalComponent {
  isOpen: boolean;
  className?: string;
  children: any;
  header?: any;
  onAfterOpen?: () => any;
  onRequestClose?: () => any;
}

class ModalComponent extends PureComponent<IModalComponent> {
  render() {
    const { children, isOpen, className, header, onAfterOpen, onRequestClose } = this.props;

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
          // @ts-ignore
          onClick={(e) => e.stopPropagation() || onRequestClose()}
        >
          <i className="ng-icon-close"></i>
        </button>
        <div className="modal-content">{children}</div>
      </Modal>
    );
  }
}

export default ModalComponent;
