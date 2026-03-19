import { BoltIcon } from 'lucide-react';
import { Button } from '@ui/Button';
import { SettingsItem } from '@features/settings/SettingsItem';
import { useSettingsLogic } from '@hooks/useSettingsLogic';

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
