import React, { PureComponent, Fragment } from "react";

class ShortDescription extends PureComponent {
  static defaultProps = {
    text: "",
    fullDescription: false,
    maxLength: 40,
  };

  render() {
    const {
      text,
      fullDescription,
      onToggleDescription,
      maxLength,
    } = this.props;
    const reachedMax = text.length > maxLength;

    return (
      <Fragment>
        <h4
          className={reachedMax ? "-toggleable" : ""}
          onClick={() => (reachedMax ? onToggleDescription() : null)}
        >
          <em>{reachedMax ? `${text.substr(0, maxLength)}...` : text}</em>
          {reachedMax && (
            <i
              className={
                fullDescription
                  ? "ng-icon-directiondown"
                  : "ng-icon-directionright"
              }
            />
          )}
        </h4>
      </Fragment>
    );
  }
}

export default ShortDescription;
