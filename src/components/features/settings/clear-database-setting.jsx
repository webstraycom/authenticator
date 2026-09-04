import { Trash2Icon } from 'lucide-react';
import { Button } from '@ui/button';
import { SettingItem } from '@features/settings/setting-item';
import { useSettingsLogic } from '@hooks/use-settings-logic';

export const ClearDatabaseSetting = () => {
  const { handleClear } = useSettingsLogic();

  return (
    <SettingItem icon={Trash2Icon} title="Clear Database" description="Clear application database">
      <Button onClick={() => handleClear()} className="w-20" variant="outline">
        Clear
      </Button>
    </SettingItem>
  );
};
