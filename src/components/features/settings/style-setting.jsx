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
import { SettingItem } from '@features/settings/setting-item';
import { useSettingsLogic } from '@hooks/use-settings-logic';

export const StyleSetting = () => {
  const { settings, updateSetting } = useSettingsLogic();

  return (
    <SettingItem icon={PaletteIcon} title="Style" description="Change application style">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-20" variant="outline">
            Set
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Select style</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={settings.style}
            onValueChange={(val) => updateSetting('style', val)}
          >
            <DropdownMenuRadioItem value="classic">Classic</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="modern">Modern</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </SettingItem>
  );
};
