import { useEffect, useRef } from 'react';

export const useShortcut = (shortcut, callback) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const handle = (e) => {
      if (e.target.closest('input:not([cmdk-input]), textarea, [contenteditable]')) return;

      const keys = [];
      if (e.ctrlKey || e.metaKey) keys.push('ctrl');
      if (e.shiftKey) keys.push('shift');
      if (e.altKey) keys.push('alt');

      const physicalKey = e.code.toLowerCase().replace(/key|digit/, '');
      keys.push(physicalKey);

      if (keys.join('+') === shortcut.toLowerCase()) {
        e.preventDefault();
        callbackRef.current();
      }
    };

    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [shortcut]);
};
