import { PanelLeft, SearchIcon } from 'lucide-react';
import { Button } from '@ui/button';
import { Kbd, KbdGroup } from '@ui/kbd';
import { Separator } from '@ui/separator';
import { useSidebar } from '@ui/sidebar';
import { useUIStore } from '@store';

export const Header = () => {
  const { toggleSidebar } = useSidebar();
  const screen = useUIStore((state) => state.currentScreen);
  const openCommandPalette = useUIStore((state) => state.openCommandPalette);

  const screenTitles = {
    passwords: 'Passwords',
    totp: 'Codes',
    tokens: 'Tokens',
    settings: 'Settings',
  };

  return (
    <div className="flex h-12 w-full shrink-0 items-center justify-center border-b px-6.5">
      <div className="flex w-full max-w-xl items-center justify-between">
        <div className="text-muted-foreground flex items-center gap-1.5">
          <Button variant="ghost" size="icon-sm" onClick={toggleSidebar}>
            <PanelLeft className="size-4" strokeWidth={2} />
          </Button>
          <Separator orientation="vertical" className="mr-1.5 size-4 !self-center" />
          <span className="text-sm font-medium">{screenTitles[screen]}</span>
        </div>
        <Button
          variant="ghost"
          onClick={openCommandPalette}
          className="group text-muted-foreground gap-1.5 px-1.5"
        >
          <SearchIcon />
          Search
          <Separator orientation="vertical" className="mx-1.5 size-4 !self-center" />
          <KbdGroup className="dark:group-hover:[&_kbd]:bg-muted group-hover:[&_kbd]:bg-foreground/5 gap-0.75 [&_kbd]:transition-all">
            <Kbd>Ctrl</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </Button>
      </div>
    </div>
  );
};
