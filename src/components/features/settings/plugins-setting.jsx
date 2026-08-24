import { PackageIcon } from 'lucide-react';
import { Button } from '@ui/button';
import { SettingItem } from '@features/settings/setting-item';
import { useSettingsLogic } from '@hooks/use-settings-logic';

export const PluginsSetting = () => {
  const { handlePluginsOpen } = useSettingsLogic();

  return (
    <SettingItem icon={PackageIcon} title="Plugins" description="Enable and disable plugins">
      <Button onClick={handlePluginsOpen} className="w-20" variant="outline">
        Open
      </Button>
    </SettingItem>
  );
};
