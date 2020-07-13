import React from 'react';
import Link from 'redux-first-router-link';

import './style.scss';

interface IProps {
  title: string;
  linkTo: {
    type: string;
    payload?: any;
  };
  key: string;
  list?: any[];
  labels?: string[];
  setPlacesSearch?: (payload) => void;
  setIndexesSelected?: (payload) => void;
  onClick?: () => void;
}

const ListItem = (props: IProps) => {
  const {
    title,
    labels,
    linkTo,
    key,
    list,
    setPlacesSearch,
    setIndexesSelected,
    onClick,
  } = props;

  // Default click action. Can be overritten by passing onClick prop
  const onClickIndex = () => {
    setPlacesSearch({ search: title });
    const [ first ] = list;
    if (!!first) {
      setIndexesSelected(first.slug);
    }
  };

  return (
    <Link
      to={linkTo}
      onClick={onClick || onClickIndex} key={key}
      className="ng-c-list-item ng-unstyled ng-padding-small-vertical ng-padding-medium-horizontal"
    >
      {title}
      {labels.map((label, i) => (
        <span className="ng-margin-left ng-color-mdgray" key={`${label}-${i}`}>{label}</span>
      ))}
    </Link>
  )
};

export default ListItem;