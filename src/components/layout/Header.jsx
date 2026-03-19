import { PanelLeft } from 'lucide-react';
import { Button } from '@ui/Button';
import { useSidebar } from '@ui/Sidebar';
import { useUIStore } from '@store';

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
    <div className="flex h-12 shrink-0 items-center border-b pl-2">
      <Button
        variant="ghost"
        type="button"
        onClick={toggleSidebar}
        className="text-muted-foreground size-7 rounded-md p-1.5 transition duration-150 hover:text-current"
      >
        <PanelLeft className="size-4" strokeWidth={2} />
      </Button>

      <span className="text-muted-foreground ml-2 text-xs font-medium tracking-wider uppercase">
        {screenTitles[screen]}
      </span>
    </div>
  );
};
