import { PaletteIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@ui/DropdownMenu';
import { Button } from '@ui/Button';
import { SettingsItem } from '@features/settings/SettingsItem';
import { useSettingsLogic } from '@hooks/useSettingsLogic';

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
          <DropdownMenuSeparator />
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
