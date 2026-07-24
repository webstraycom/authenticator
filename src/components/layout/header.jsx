import { useUIStore } from '@store';
import { PanelLeft } from 'lucide-react';
import { Button } from '@ui/button';
import { useSidebar } from '@ui/sidebar';

export const Header = () => {
  const { toggleSidebar } = useSidebar();
  const screen = useUIStore((state) => state.currentScreen);

  const screenTitles = {
    passwords: 'Passwords',
    totp: 'Codes',
    tokens: 'Tokens',
    settings: 'Settings',
  };

  return (
    <div className="flex h-12 shrink-0 items-center gap-1.5 border-b px-6.5">
      <Button
        variant="ghost"
        type="button"
        onClick={toggleSidebar}
        className="text-muted-foreground size-7 rounded-md p-1.5 transition duration-150 hover:text-current"
      >
        <PanelLeft className="size-4" strokeWidth={2} />
      </Button>

      <span className="text-muted-foreground text-xs font-medium uppercase">
        {screenTitles[screen]}
      </span>
    </div>
  );
};
