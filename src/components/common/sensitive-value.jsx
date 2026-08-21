import { AnimatePresence, motion } from 'motion/react';

export const SensitiveValue = ({ value, isVisible, onCopy, type = 'password' }) => {
  return (
    <button
      type="button"
      disabled={!isVisible}
      onClick={onCopy}
      className={`bg-muted relative flex max-w-50 min-w-[80px] items-center justify-center overflow-hidden rounded-md px-2 py-1 text-xs transition-all duration-200 outline-none focus-visible:ring-4 focus-visible:ring-neutral-300 dark:bg-neutral-800 dark:focus-visible:ring-neutral-700 ${isVisible ? 'w-fit font-mono hover:bg-neutral-200 active:scale-90 dark:hover:bg-neutral-700' : 'font-masked w-[80px]'} `}
      aria-label={isVisible ? `Copy ${type}` : null}
      aria-hidden={!isVisible ? 'true' : null}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={isVisible ? 'visible' : 'masked'}
          initial={{ opacity: 0, y: 5, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -5, filter: 'blur(4px)' }}
          transition={{ duration: 0.3 }}
          className="inline-block whitespace-nowrap select-none"
        >
          {isVisible
            ? value.length > 20
              ? `${value.slice(0, 20)}...`
              : value
            : '••••••••'}
        </motion.span>
      </AnimatePresence>
    </button>
  );
};
