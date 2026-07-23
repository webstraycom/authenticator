import { PackageIcon } from 'lucide-react';
import { Button } from '@ui/Button';
import { SettingsItem } from '@/components/features/settings/SettingItem';
import { useSettingsLogic } from '@hooks/useSettingsLogic';

export const PluginsSetting = () => {
  const { handlePluginsOpen } = useSettingsLogic();

  return (
    <SettingsItem icon={PackageIcon} title="Plugins" description="Enable and disable plugins">
      <Button onClick={handlePluginsOpen} className="w-20" variant="outline">
        Open
      </Button>
    </SettingsItem>
  );
};
