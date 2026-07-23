import { BoltIcon } from 'lucide-react';
import { Button } from '@ui/button';
import { SettingsItem } from '@features/settings/setting-item';
import { useSettingsLogic } from '@hooks/use-settings-logic';

export const CompactDatabaseSetting = () => {
  const { handleCompaction } = useSettingsLogic();

  return (
    <SettingsItem
      icon={BoltIcon}
      title="Compact Database"
      description="Compact application database"
    >
      <Button onClick={handleCompaction} className="w-20" variant="outline">
        Compact
      </Button>
    </SettingsItem>
  );
};
