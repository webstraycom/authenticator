import { useCallback } from 'react';

export const useFocusOnMount = () => {
  return useCallback((node) => {
    if (node) {
      queueMicrotask(() => {
        node.focus({ preventScroll: true });
      });
    }
  }, []);
};
