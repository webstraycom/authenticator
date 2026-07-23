import { LockKeyholeIcon } from 'lucide-react';
import { Button } from '@ui/button';
import { SettingsItem } from '@features/settings/setting-item';
import { useSettingsLogic } from '@hooks/use-settings-logic';

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
