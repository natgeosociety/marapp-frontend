import React from 'react';

// Styles
import './styles.scss';

interface TooltipProps {
  payload: [];
  settings: any;
  style: {};
  hideZeros: boolean;
}

class Tooltip extends React.PureComponent<TooltipProps> {
  static defaultProps = {
    payload: [],
    style: {},
    hideZeros: false,
  };

  getValue = (item, value) => {
    const { format, suffix = '', preffix = '' } = item;
    let val = value;

    if (format && typeof format === 'function') {
      val = format(val);
    }

    return `${preffix}${val}${suffix}`;
  };

  render() {
    const { payload, settings, style, hideZeros } = this.props;

    // @ts-ignore
    const values = payload && payload.length > 0 && payload[0].payload;

    return (
      <div>
        {settings && settings.length && (
          <div className="c-chart-tooltip" style={style}>
            {settings.map((d: any) =>
              hideZeros && !values[d.key] ? null : (
                <div key={d.key} className={`data-line ${d.position || ''}`}>
                  {/* LABEL */}
                  {(d.label || d.labelKey) && (
                    <div className="data-label">
                      {d.color && (
                        <div className="data-color" style={{ backgroundColor: d.color }} />
                      )}

                      {d.key === 'break' ? (
                        <span className="break-label">{d.label}</span>
                      ) : (
                        <span>{d.label || values[d.labelKey]}</span>
                      )}
                    </div>
                  )}

                  {/* UNIT */}
                  <div className="data-value">{this.getValue(d, values[d.key])}</div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Tooltip;
