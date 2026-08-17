import { PaletteIcon } from 'lucide-react';
import { Button } from '@ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu';
import { SettingsItem } from '@features/settings/setting-item';
import { useSettingsLogic } from '@hooks/use-settings-logic';

export const ThemeSetting = () => {
  const { settings, updateSetting } = useSettingsLogic();

  return (
    <SettingsItem icon={PaletteIcon} title="Theme" description="Change appearance">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-20" variant="outline">
            Set
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="end">
          <DropdownMenuLabel>Select theme</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={settings.theme}
            onValueChange={(val) => updateSetting('theme', val)}
          >
            <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </SettingsItem>
  );
};
