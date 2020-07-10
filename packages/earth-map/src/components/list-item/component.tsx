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
  labels?: string[];
  onClick?: () => void;
}

const ListItem = (props: IProps) => {
  const {
    title,
    labels,
    linkTo,
    key,
    onClick = () => { },
  } = props;

  return (
    <Link
      to={linkTo}
      onClick={onClick} key={key}
      className="ng-c-list-item ng-unstyled ng-padding-small-vertical ng-padding-medium-horizontal"
    >
      {title.split(/({{.+}})/).map(term => (
        term.startsWith('{{') && term.endsWith('}}') ?
        <b style={{ fontWeight: 900 }}>{term.replace('{{', '').replace('}}', '')}</b> :
        term
      ))}
      {labels.map((label, i) => (
        <span className="ng-margin-left ng-color-mdgray" key={`${label}-${i}`}>{label}</span>
      ))}
    </Link>
  )
};

export default ListItem;