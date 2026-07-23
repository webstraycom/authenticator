import React from 'react';
import {
  ThemeSetting,
  VerificationTimeoutSetting,
  ImportSetting,
  ExportSetting,
  CompactDatabaseSetting,
  ClearDatabaseSetting,
  ChangeMasterPasswordSetting,
  PluginsSetting,
} from '@features/settings';
import { ItemGroup } from '@ui/item';
import { Button } from '@ui/button';
import { useSettingsLogic } from '@hooks/use-settings-logic';

export const SettingsScreen = () => {
  const { handleReset } = useSettingsLogic();

  return (
    <section className="relative flex h-full w-full flex-col items-center">
      <div className="w-full flex-1 overflow-y-auto scroll-fade scroll-fade-24">
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
