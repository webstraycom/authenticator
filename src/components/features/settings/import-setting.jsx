import { DownloadIcon } from 'lucide-react';
import { Button } from '@ui/button';
import { SettingsItem } from '@features/settings/setting-item';
import { useSettingsLogic } from '@hooks/use-settings-logic';

export const ImportSetting = () => {
  const { handleImport } = useSettingsLogic();

  return (
    <SettingsItem
      icon={DownloadIcon}
      title="Import Data"
      description="Import passwords, codes and tokens from JSON"
    >
      <Button onClick={handleImport} className="w-20" variant="outline">
        Import
      </Button>
    </SettingsItem>
  );
};
