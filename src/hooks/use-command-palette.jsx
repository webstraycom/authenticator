import { useEffect, useMemo } from 'react';
import { useAuthStore, useCodesStore, usePasswordsStore, useTokensStore, useUIStore } from '@store';
import { toast } from 'sonner';
import { useDatabase } from '@hooks/use-database';
import { withDelay } from '@utils/delays';

export const useCommandPalette = () => {
  const isOpen = useUIStore((state) => state.isCommandPaletteOpen);
  const openCommandPalette = useUIStore((state) => state.openCommandPalette);
  const closeCommandPalette = useUIStore((state) => state.closeCommandPalette);

  const setScreen = useUIStore((state) => state.setScreen);
  const runWithVerification = useUIStore((state) => state.runWithVerification);

  const openAddPassword = useUIStore((state) => state.openAddPassword);
  const openAddCode = useUIStore((state) => state.openAddCode);
  const openAddToken = useUIStore((state) => state.openAddToken);

  const loadPasswords = usePasswordsStore((state) => state.loadPasswords);
  const loadCodes = useCodesStore((state) => state.loadCodes);
  const loadTokens = useTokensStore((state) => state.loadTokens);

  const openDataManagement = useUIStore((state) => state.openDataManagement);
  const openPlugins = useUIStore((state) => state.openPlugins);
  const openConfirm = useUIStore((state) => state.openConfirm);

  const logout = useAuthStore((state) => state.logout);

  const { compactDatabase } = useDatabase();

  const passwordsConfig = useMemo(
    () => ({
      type: 'password',
      importedItems: 'Passwords',
      onSuccess: loadPasswords,
    }),
    [loadPasswords],
  );

  const totpConfig = useMemo(
    () => ({
      type: 'totp',
      importedItems: 'Codes',
      onSuccess: () => loadCodes(),
    }),
    [loadCodes],
  );

  const tokensConfig = useMemo(
    () => ({
      type: 'token',
      importedItems: 'Tokens',
      onSuccess: () => loadTokens(),
    }),
    [loadTokens],
  );

  const dataConfig = useMemo(
    () => ({
      importedItems: 'Data',
      onSuccess: async () => {
        await Promise.all([loadPasswords(true), loadCodes(true), loadTokens(true)]);
      },
    }),
    [loadPasswords, loadCodes, loadTokens],
  );

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.code === 'KeyK' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        isOpen ? closeCommandPalette() : openCommandPalette();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, openCommandPalette, closeCommandPalette]);

  const execute = (action) => {
    closeCommandPalette();
    action();
  };

  return {
    isOpen,
    closeCommandPalette,
    execute,
    actions: {
      screens: {
        openPasswords: () => setScreen('passwords'),
        openCodes: () => setScreen('totp'),
        openTokens: () => setScreen('tokens'),
        openSettings: () => runWithVerification(() => setScreen('settings')),
      },
      passwords: {
        addPassword: openAddPassword,
        importPasswords: () => runWithVerification(() => openDataManagement(passwordsConfig)),
        exportPasswords: () =>
          runWithVerification(() => openDataManagement({ ...passwordsConfig, mode: 'export' })),
      },
      codes: {
        addCode: openAddCode,
        importCodes: () => runWithVerification(() => openDataManagement(totpConfig)),
        exportCodes: () =>
          runWithVerification(() => openDataManagement({ ...totpConfig, mode: 'export' })),
      },
      tokens: {
        addToken: openAddToken,
        importTokens: () => runWithVerification(() => openDataManagement(tokensConfig)),
        exportTokens: () =>
          runWithVerification(() => openDataManagement({ ...tokensConfig, mode: 'export' })),
      },
      general: {
        importData: () => runWithVerification(() => openDataManagement(dataConfig)),
        exportData: () =>
          runWithVerification(() => openDataManagement({ ...dataConfig, mode: 'export' })),
        compactDatabase: () =>
          toast.promise(withDelay(compactDatabase()), {
            loading: 'Compacting database...',
            success: 'Database successfully compacted!',
            error: 'Compaction failed',
          }),
        openPlugins: () => runWithVerification(openPlugins, { force: true }),
        signOut: () =>
          openConfirm({
            title: 'Sign Out?',
            description: 'Are you sure you want to log out?',
            buttonText: 'Sign Out',
            onConfirm: () => {
              logout();
              setScreen('passwords');
            },
          }),
      },
    },
  };
};
