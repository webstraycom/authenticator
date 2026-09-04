import { EclipseIcon } from 'lucide-react';
import { Button } from '@ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu';
import { SettingItem } from '@features/settings/setting-item';
import { useSettingsLogic } from '@hooks/use-settings-logic';

export const ThemeSetting = () => {
  const { settings, updateSettings } = useSettingsLogic();

  return (
    <SettingItem icon={EclipseIcon} title="Theme" description="Change appearance">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-20" variant="outline">
            Set
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Select theme</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={settings.theme}
            onValueChange={(val) => updateSettings({ theme: val })}
          >
            <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </SettingItem>
  );
};
