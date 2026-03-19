import { Trash2Icon } from 'lucide-react';
import { Button } from '@ui/Button';
import { SettingsItem } from '@features/settings/SettingsItem';
import { useSettingsLogic } from '@hooks/useSettingsLogic';

export const ClearDatabaseSetting = () => {
  const { handleClear } = useSettingsLogic();

  return (
    <SettingsItem icon={Trash2Icon} title="Clear Database" description="Clear application database">
      <Button onClick={() => handleClear()} className="w-20" variant="outline">
        Clear
      </Button>
    </SettingsItem>
  );
};
