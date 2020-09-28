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

import React, { ReactNode } from 'react';
import { animated, Keyframes } from 'react-spring/renderprops';

import './styles.scss';

interface IDropdownComponent {
  state?: string;
  children: ReactNode;
}

const DropdownPanel: any = Keyframes.Spring({
  close: { x: `-100vh`, delay: 0 },
  open: { x: '0vh', from: { x: 0 } },
});

export default function DropdownComponent(props: IDropdownComponent) {
  const { state, children } = props;

  return (
    <DropdownPanel native={true} state={state}>
      {({ x, ...props }) => (
        <animated.ul
          className="marapp-qa-dropdown ng-ep-dropdown ng-section-background"
          style={{
            transform: x.interpolate((x) => `translate3d(0,${x},0)`),
            ...props,
          }}
        >
          {children}
        </animated.ul>
      )}
    </DropdownPanel>
  );
}
