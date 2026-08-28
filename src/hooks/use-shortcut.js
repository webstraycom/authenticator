import { useEffect, useRef } from 'react';

export const useShortcut = (shortcut, callback, options = {}) => {
  const { disabled = () => false } = options;

  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;

  useEffect(() => {
    const handle = (e) => {
      if (e.target.closest('input:not([cmdk-input]), textarea, [contenteditable]')) return;
      if (disabledRef.current()) return;

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
