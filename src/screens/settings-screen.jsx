import { Button } from '@ui/button';
import { ItemGroup } from '@ui/item';
import {
  ChangeMasterPasswordSetting,
  ClearDatabaseSetting,
  CompactDatabaseSetting,
  ExportSetting,
  ImportSetting,
  PluginsSetting,
  ThemeSetting,
  VerificationTimeoutSetting,
} from '@features/settings';
import { useSettingsLogic } from '@hooks/use-settings-logic';

export const SettingsScreen = () => {
  const { handleReset } = useSettingsLogic();

  return (
    <div className="flex h-full w-full flex-col items-center">
      <ItemGroup className="flex flex-col gap-4 p-8 scroll-fade scroll-fade-24 w-full flex-1 overflow-y-auto">
        <ThemeSetting />
        <VerificationTimeoutSetting />
        <ChangeMasterPasswordSetting />
        <ImportSetting />
        <ExportSetting />
        <CompactDatabaseSetting />
        <ClearDatabaseSetting />
        <PluginsSetting />
      </ItemGroup>
      <div className="flex w-full justify-center p-8">
        <div className="flex w-full max-w-xl items-center justify-end gap-2">
          <Button onClick={handleReset} variant="outline">
            Reset Settings
          </Button>
        </div>
      </div>
    </div>
  );
};
