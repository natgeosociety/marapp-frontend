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
  list?: [];
  labels?: string[];
  setPlacesSearch?: () => void;
  setIndexesSelected?: () => void;
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
    // @ts-ignore
    setPlacesSearch({ search: title });
    // @ts-ignore
    !!list[0] && setIndexesSelected(list[0].slug);
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