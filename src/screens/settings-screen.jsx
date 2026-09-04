import { Button } from '@ui/button';
import { ItemGroup } from '@ui/item';
import {
  ChangeMasterPasswordSetting,
  ClearDatabaseSetting,
  CompactDatabaseSetting,
  ExportSetting,
  ImportSetting,
  PluginsSetting,
  StyleSetting,
  ThemeSetting,
  VerificationTimeoutSetting,
} from '@features/settings';
import { useSettingsLogic } from '@hooks/use-settings-logic';

export const SettingsScreen = () => {
  const { handleReset } = useSettingsLogic();

  return (
    <div className="flex h-full w-full flex-col items-center">
      <ItemGroup className="scroll-fade scroll-fade-24 grid flex-1 grid-cols-1 content-start gap-4 overflow-y-auto p-8 lg:grid-cols-2 2xl:grid-cols-3">
        <ThemeSetting />
        <StyleSetting />
        <VerificationTimeoutSetting />
        <ChangeMasterPasswordSetting />
        <ImportSetting />
        <ExportSetting />
        <CompactDatabaseSetting />
        <ClearDatabaseSetting />
        <PluginsSetting />
      </ItemGroup>
      <div className="flex w-full justify-center p-8">
        <div className="flex w-full items-center justify-end gap-2">
          <Button onClick={handleReset} variant="outline">
            Reset Settings
          </Button>
        </div>
      </div>
    </div>
  );
};
