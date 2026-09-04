import { useEffect, useState } from 'react';
import { runViewTransition } from '@utils/view-transition';

export function useAppLoaded() {
  const [isAppLoaded, setIsAppLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      runViewTransition(() => setIsAppLoaded(true));
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return isAppLoaded;
}
