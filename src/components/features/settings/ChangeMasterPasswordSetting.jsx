import { LockKeyholeIcon } from 'lucide-react';
import { Button } from '@ui/Button';
import { SettingsItem } from '@/components/features/settings/SettingItem';
import { useSettingsLogic } from '@hooks/useSettingsLogic';

export const ChangeMasterPasswordSetting = () => {
  const { handleMasterPasswordChange } = useSettingsLogic();

  return (
    <SettingsItem
      icon={LockKeyholeIcon}
      title="Change Master Password"
      description="Change your master password"
    >
      <Button onClick={handleMasterPasswordChange} className="w-20" variant="outline">
        Change
      </Button>
    </SettingsItem>
  );
};
