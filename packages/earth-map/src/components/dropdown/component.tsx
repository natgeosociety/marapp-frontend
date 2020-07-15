import React, { ReactNode, useContext, useState } from 'react';

import './styles.scss';
import {Keyframes, animated} from 'react-spring/renderprops'

interface IDropdownComponent {
  state?: string;
  children: ReactNode;
}

const DropdownPanel: any = Keyframes.Spring({
  close: { x: -1000, delay: 0 },
  open: { x: 0, from: { x: 0 } },
});

export default function DropdownComponent(props: IDropdownComponent) {
  const { state, children } = props;

  return (
    <DropdownPanel native state={state}>
      {({ x, ...props }) => (
        <animated.ul
          className="ng-ep-dropdown ng-section-background"
          style={{
            transform: x.interpolate((x) => `translate3d(0,${x}px,0)`),
            ...props,
          }}
        >
          {children}
        </animated.ul>
      )}
    </DropdownPanel>
  );
}
