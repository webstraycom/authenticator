import React from 'react';
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
    <section className="relative flex h-full w-full flex-col items-center">
      <div className="scroll-fade scroll-fade-24 w-full flex-1 overflow-y-auto">
        <ItemGroup className="flex w-full flex-col items-center gap-4 p-8">
          <ThemeSetting />
          <VerificationTimeoutSetting />
          <ChangeMasterPasswordSetting />
          <ImportSetting />
          <ExportSetting />
          <CompactDatabaseSetting />
          <ClearDatabaseSetting />
          <PluginsSetting />
        </ItemGroup>
      </div>
      <div className="flex w-full justify-center p-8">
        <div className="flex w-full max-w-xl items-center justify-end gap-2">
          <Button onClick={handleReset} variant="outline" className="gap-1">
            Reset Settings
          </Button>
        </div>
      </div>
    </section>
  );
};
