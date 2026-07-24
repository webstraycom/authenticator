import { useCallback, useEffect, useRef, useState } from 'react';
import { useUIStore } from '@store';
import { toast } from 'sonner';

export const useSensitiveData = (value, type = 'Item') => {
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef(null);
  const runWithVerification = useUIStore((state) => state.runWithVerification);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const hide = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsVisible(false);
  }, []);

  const show = useCallback(() => {
    runWithVerification(
      () => {
        if (timerRef.current) clearTimeout(timerRef.current);

        setIsVisible(true);

        timerRef.current = setTimeout(() => {
          hide();
        }, 5000);
      },
      { description: 'Please enter your master password to view sensitive data.' },
    );
  }, [runWithVerification, hide]);

  const copy = useCallback(() => {
    if (isVisible) {
      navigator.clipboard.writeText(value);
      toast.success(`${type} has been copied to clipboard!`);
      hide();
    }
  }, [isVisible, value, type, hide]);

  return { isVisible, show, hide, copy };
};
