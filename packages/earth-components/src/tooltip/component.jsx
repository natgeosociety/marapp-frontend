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

    const CONTENT_CLASSES = classNames('marapp-qa-tooltip', 'ng-c-tooltip-content', {
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
