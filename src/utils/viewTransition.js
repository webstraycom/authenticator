import { flushSync } from 'react-dom';

export const runViewTransition = (updateCallback) => {
  const transition = document.startViewTransition(() => {
    flushSync(() => {
      updateCallback();
    });
  });

  transition.ready.then(() => {
    const commonOptions = {
      duration: 250,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      fill: 'both',
    };

    document.documentElement.animate(
      [
        { opacity: 1, filter: 'blur(0px)' },
        { opacity: 0, filter: 'blur(4px)' },
      ],
      { ...commonOptions, pseudoElement: '::view-transition-old(root)' },
    );

    document.documentElement.animate(
      [
        { opacity: 0, filter: 'blur(4px)' },
        { opacity: 1, filter: 'blur(0px)' },
      ],
      { ...commonOptions, pseudoElement: '::view-transition-new(root)' },
    );
  });

  return transition;
};
