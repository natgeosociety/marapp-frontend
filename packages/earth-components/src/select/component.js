import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Styles
import './styles.scss';

class Select extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    value: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({})),
    onChange: PropTypes.func
  };

  state = {
    value: this.props.value || this.props.options[0].value
  }

  onChange = (e) => {
    const { onChange } = this.props;
    const { value } = e.currentTarget;

    this.setState({ value });
    onChange(value);
  }

  render() {
    const { options, className } = this.props;

    const { value } = this.state;
    const selectedValue = options.find(o => o.value === value) || {};

    return (
      <div
        className={classnames({
          'c-select': true,
          [className]: !!className
        })}
      >
        <span className="select--value">{selectedValue.label || value}</span>
        <select
          className="select--input"
          onChange={this.onChange}
          value={value}
        >
          {options.map(l => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

export default Select;
