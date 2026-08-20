import { useEffect, useRef, useState } from 'react';
import { CopyIcon, MinusIcon, XIcon } from 'lucide-react';
import { Button } from '@ui/button';
import { Logo } from '@common/logo';
import { cn } from '@lib/utils';

export const TitleBar = ({ className }) => {
  const [isMaximized, setIsMaximized] = useState(false);

  const winRef = useRef(window.nw ? window.nw.Window.get() : null);

  useEffect(() => {
    const win = winRef.current;
    if (!win) return;

    const onMaximize = () => setIsMaximized(true);
    const onRestore = () => setIsMaximized(false);

    win.on('maximize', onMaximize);
    win.on('restore', onRestore);

    return () => {
      win.removeListener('maximize', onMaximize);
      win.removeListener('restore', onRestore);
    };
  }, []);

  const handleMinimize = () => winRef.current?.minimize();

  const handleMaximize = () => {
    const win = winRef.current;
    if (!win) return;

    if (isMaximized) {
      win.restore();
    } else {
      win.maximize();
    }
  };

  const handleClose = () => winRef.current?.close();

  return (
    <nav
      className={cn(
        'border-border bg-background z-100 flex h-10 w-full shrink-0 flex-nowrap items-center justify-between border-b pr-2 pl-4',
        className,
      )}
      style={{ WebkitAppRegion: 'drag' }}
    >
      <a tabIndex={-1} className="flex items-center gap-2">
        <Logo />
        <span className="self-center text-sm font-medium whitespace-nowrap">
          WebStray Authenticator
        </span>
      </a>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleMinimize}
          className="text-muted-foreground hover:text-foreground"
          style={{ WebkitAppRegion: 'no-drag' }}
        >
          <MinusIcon className='size-4' />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleMaximize}
          className="text-muted-foreground hover:text-foreground"
          style={{ WebkitAppRegion: 'no-drag' }}
        >
          <CopyIcon className="size-3 scale-x-[-1]" />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleClose}
          className="text-muted-foreground hover:text-foreground"
          style={{ WebkitAppRegion: 'no-drag' }}
        >
          <XIcon className='size-4' />
        </Button>
      </div>
    </nav>
  );
};
