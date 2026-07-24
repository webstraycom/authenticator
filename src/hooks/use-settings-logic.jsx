import {
  useCodesStore,
  usePasswordsStore,
  useSettingsStore,
  useTokensStore,
  useUIStore,
} from '@store';
import { toast } from 'sonner';
import { useClearDatabase } from '@hooks/use-clear-database';
import { useDatabase } from '@hooks/use-database';
import { withDelay } from '@utils/delays';

export const useSettingsLogic = () => {
  const settings = useSettingsStore((state) => state.settings);
  const updateSetting = useSettingsStore((state) => state.updateSetting);
  const initializeDefaultSettings = useSettingsStore((state) => state.initializeDefaultSettings);
  const openDataManagement = useUIStore((state) => state.openDataManagement);
  const openConfirm = useUIStore((state) => state.openConfirm);
  const openChangeMasterPassword = useUIStore((state) => state.openChangeMasterPassword);
  const openPlugins = useUIStore((state) => state.openPlugins);

  const loadPasswords = usePasswordsStore((state) => state.loadPasswords);
  const loadCodes = useCodesStore((state) => state.loadCodes);
  const loadTokens = useTokensStore((state) => state.loadTokens);

  const runWithVerification = useUIStore((state) => state.runWithVerification);

  const { handleClear } = useClearDatabase();
  const { compactDatabase } = useDatabase();

  const baseConfig = {
    importedItems: 'Data',
    onSuccess: async () => {
      await Promise.all([loadPasswords(true), loadCodes(true), loadTokens(true)]);
    },
  };

  const adjustTimeout = (delta) => {
    const currentValue = Number(settings.verificationTimeout) || 0;
    updateSetting('verificationTimeout', Math.max(0, currentValue + delta));
  };

  const handleMasterPasswordChange = () => {
    openChangeMasterPassword();
  };

  const handleCompaction = () => {
    toast.promise(withDelay(compactDatabase()), {
      loading: 'Compacting database...',
      success: 'Database successfully compacted!',
      error: 'Compaction failed',
    });
  };

  const handleImport = () => openDataManagement(baseConfig);

  const handleExport = () => openDataManagement({ ...baseConfig, mode: 'export' });

  const handlePluginsOpen = () => runWithVerification(openPlugins, { force: true });

  const handleReset = () => {
    openConfirm({
      title: 'Reset Settings?',
      description: 'This will revert all settings to their default values.',
      buttonText: 'Reset',
      onConfirm: async () => {
        try {
          await initializeDefaultSettings();
          toast.success('Settings reset to defaults');
        } catch (err) {
          console.error(err);
          toast.error('Failed to reset settings');
        }
      },
    });
  };

  return {
    settings,
    updateSetting,
    adjustTimeout,
    handleMasterPasswordChange,
    handleCompaction,
    handleImport,
    handleExport,
    handlePluginsOpen,
    handleClear,
    handleReset,
  };
};
