import React, { useEffect } from "react";

export default function useDomWatcher(ref, callback, skip) {
  useEffect(() => {
    if (skip) return;

    const handleClickOutside = event => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback && callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, skip]);
}
