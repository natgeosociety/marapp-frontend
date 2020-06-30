import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

// styles
import "./styles.scss";

class LayerComponent extends PureComponent {
  static propTypes = {
    slug: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    background: PropTypes.string,
    dark: PropTypes.bool,
    active: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    onClickInfo: PropTypes.func,
  };

  static defaultProps = {
    background: "",
    active: false,
    onClickInfo: null,
  };

  render() {
    const {
      slug,
      name,
      category,
      background,
      dark,
      active,
      onClick,
      onClickInfo,
    } = this.props;

    return (
      <div
        key={slug}
        className={classnames({
          "c-layer": true,
          "-dark": dark,
          "-horizontal": !background,
          "-active": active,
        })}
        role="button"
        tabIndex="-1"
        onClick={onClick}
      >
        {!background && (
          <div className="layers--item-switch">
            <span />
          </div>
        )}
        {background && (
          <div
            className="layers--item-bg"
            style={{ backgroundImage: `url(${background})` }}
          />
        )}
        <div className="layers--item-title">
          <span className="ng-margin-right">{name}</span>
          <span className="layers--item-category">{category}</span>
        </div>

        {!!onClickInfo && (
          <button
            type="button"
            className="layers--item-info"
            onClickInfo={onClickInfo}
          >
            <i className="ng-icon-info-circle" />
          </button>
        )}
      </div>
    );
  }
}

export default LayerComponent;
