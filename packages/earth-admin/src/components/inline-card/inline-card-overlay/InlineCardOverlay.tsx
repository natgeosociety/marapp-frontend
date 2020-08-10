import React, {useEffect} from 'react';
import { createPortal } from "react-dom";

import { InlineCardProps } from '../InlineCard';

type InlineCardOverlayProps = Partial<InlineCardProps>;

import './styles.scss';

const InlineCardOverlay = ( props: Partial<InlineCardOverlayProps> ) => {
  const mount = document.getElementById("page-wrapper");
  const el = document.createElement("div");

  useEffect(() => {
    mount.appendChild(el);
    return () => mount.removeChild(el);
  }, [el, mount]);

  return createPortal(<div className="ng-inline-card-overlay"/>, el)
};

export default InlineCardOverlay;
