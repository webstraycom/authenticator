import { SearchIcon } from 'lucide-react';
import { Button } from '@ui/button';
import { Kbd, KbdGroup } from '@ui/kbd';
import { Separator } from '@ui/separator';
import { SidebarTrigger } from '@ui/sidebar';
import { useUIStore } from '@store';

export const Header = () => {
  const screen = useUIStore((state) => state.currentScreen);
  const openCommandPalette = useUIStore((state) => state.openCommandPalette);

  const screenTitles = {
    passwords: 'Passwords',
    totp: 'Codes',
    tokens: 'Tokens',
    settings: 'Settings',
  };

  return (
    <header
      className="modern:border-none relative flex h-12 w-full shrink-0 items-center justify-center border-b px-6.5"
      aria-label="Application toolbar"
    >
      <div className="flex w-full items-center justify-between">
        <div className="text-muted-foreground flex items-center gap-1.5">
          <SidebarTrigger aria-keyshortcuts="control+b" />
          <Separator orientation="vertical" className="mr-1.5 size-4 !self-center" />
          <h1 className="text-sm font-medium">{screenTitles[screen]}</h1>
        </div>
        <Button
          variant="ghost"
          onClick={openCommandPalette}
          className="group text-muted-foreground px-1.5"
          aria-label="Open command palette"
          aria-keyshortcuts="control+k"
        >
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <SearchIcon />
            Search
            <Separator orientation="vertical" className="mx-1.5 size-4 !self-center" />
            <KbdGroup className="dark:group-hover:[&_kbd]:bg-muted group-hover:[&_kbd]:bg-foreground/5 gap-0.75 [&_kbd]:transition-all">
              <Kbd>Ctrl</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
          </div>
        </Button>
      </div>
      <Separator
        orientation="horizontal"
        className="via-border modern:block absolute bottom-0 hidden bg-gradient-to-r from-transparent to-transparent"
      />
    </header>
  );
};
