import React, { useEffect, useState } from 'react';
import { useTransition, animated } from 'react-spring';
import { Transition } from 'react-spring/renderprops';
import { useSpring } from 'react-spring';

import { InlineCardProps } from '../InlineCard';

type InlineCardOverlayProps = { show: boolean }

import './styles.scss';


const InlineCardOverlay = ( { show } ) => {

  const props = useSpring({opacity: 1, from: {opacity: 0}});


  return <animated.div style={props}>I will fade in</animated.div>
}

export default InlineCardOverlay;
