import React from 'react';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';

// Components
import { Icon, Spinner } from '@marapp/earth-components';
import { SECTIONS } from 'components/place/constants';

interface IPlaceSelected {
  data?: { name: string };
  loading?: boolean;
  setPlaceSelectedOpen?: (b: boolean) => {};
  selectedOpen?: any;
}

class PlaceSelectedComponent extends React.PureComponent<IPlaceSelected> {
  static propTypes = {};

  onToggleOpen = () => {
    const { selectedOpen, setPlaceSelectedOpen } = this.props;

    setPlaceSelectedOpen(!selectedOpen);
  };

  render() {
    const { data, loading, selectedOpen } = this.props;
    if (isEmpty(data)) {
      return null;
    }

    const { name } = data;
    const relations = SECTIONS.some(s => data[s] && data[s].length);

    return (
      <div
        className={classnames({
          'place--selected': true,
          '-no-data': !relations,
        })}
        onClick={relations ? this.onToggleOpen : undefined}
      >
        <h5>Selected place</h5>
        <h4 className="place--title">{name}</h4>

        {relations && (
          <div className="place--icon">
            <Icon
              name={selectedOpen ? 'icon-arrow-up-2' : 'icon-arrow-down-2'}
              className="-smaller"
            />
          </div>
        )}

        {/* Spinner */}
        {loading && (
          <Spinner className="place--spinner" />
        )}
      </div>
    );
  }
}

export default PlaceSelectedComponent;
