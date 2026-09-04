import { UploadIcon } from 'lucide-react';
import { Button } from '@ui/button';
import { SettingItem } from '@features/settings/setting-item';
import { useSettingsLogic } from '@hooks/use-settings-logic';

export const ExportSetting = () => {
  const { handleExport } = useSettingsLogic();

  return (
    <SettingItem
      icon={UploadIcon}
      title="Export Data"
      description="Export passwords, codes and tokens to JSON"
    >
      <Button onClick={handleExport} className="w-20" variant="outline">
        Export
      </Button>
    </SettingItem>
  );
};
