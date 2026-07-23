import { UploadIcon } from 'lucide-react';
import { Button } from '@ui/Button';
import { SettingsItem } from '@/components/features/settings/SettingItem';
import { useSettingsLogic } from '@hooks/useSettingsLogic';

export const ExportSetting = () => {
  const { handleExport } = useSettingsLogic();

  return (
    <SettingsItem
      icon={UploadIcon}
      title="Export Data"
      description="Export passwords, codes and tokens to JSON"
    >
      <Button onClick={handleExport} className="w-20" variant="outline">
        Export
      </Button>
    </SettingsItem>
  );
};
