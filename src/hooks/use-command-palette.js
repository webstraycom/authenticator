import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useAuthStore, useCodesStore, usePasswordsStore, useTokensStore, useUIStore } from '@store';
import { useDatabase } from '@hooks/use-database';
import { useShortcut } from '@hooks/use-shortcut';
import { withDelay } from '@utils/delays';
import { getTOTP } from '@utils/totp';

export const useCommandPalette = () => {
  const isCommandPaletteOpen = useUIStore((state) => state.isCommandPaletteOpen);
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

  const passwords = usePasswordsStore((state) => state.passwords);
  const codes = useCodesStore((state) => state.codes);
  const tokens = useTokensStore((state) => state.tokens);

  const openDataManagement = useUIStore((state) => state.openDataManagement);
  const openPlugins = useUIStore((state) => state.openPlugins);
  const openConfirm = useUIStore((state) => state.openConfirm);

  const logout = useAuthStore((state) => state.logout);

  const { compactDatabase } = useDatabase();

  const [selectedId, setSelectedId] = useState('');

  const toggleCommandPalette = useCallback(() => {
    isCommandPaletteOpen ? closeCommandPalette() : openCommandPalette();
  }, [isCommandPaletteOpen, openCommandPalette, closeCommandPalette]);

  useShortcut('ctrl+k', toggleCommandPalette);
  useShortcut('ctrl+f', toggleCommandPalette);

  useEffect(() => {
    loadPasswords();
    loadCodes();
    loadTokens();
  }, []);

  useEffect(() => {
    if (!isCommandPaletteOpen) setSelectedId('');
  }, [isCommandPaletteOpen]);

  const runAction = useCallback(
    (action) => {
      closeCommandPalette();
      action();
    },
    [closeCommandPalette],
  );

  const dataItems = useMemo(() => {
    const sources = [
      {
        items: passwords,
        icon: 'password',
        type: 'Password',
        message: 'Password has been copied to clipboard!',
        getValue: (p) => p.value,
      },
      {
        items: codes,
        icon: 'code',
        type: 'Code',
        message: 'Code has been copied to clipboard!',
        getValue: (c) => getTOTP(c.value, Date.now()).token,
      },
      {
        items: tokens,
        icon: 'token',
        type: 'Token',
        message: 'Token has been copied to clipboard!',
        getValue: (t) => t.value,
      },
    ];

    return sources.flatMap(({ items, icon, type, message, getValue }) =>
      items
        .filter((item) => !item.isCorrupted)
        .map((item) => ({
          id: item._id,
          label: item.site || item.service,
          hint: item.login || item.account || item.endpoint,
          icon,
          type,
          action: () =>
            runWithVerification(() => {
              navigator.clipboard.writeText(getValue(item));
              toast.success(message);
            }),
        })),
    );
  }, [passwords, codes, tokens, runWithVerification]);

  const groupedCommands = useMemo(() => {
    const passwordsConfig = {
      type: 'password',
      importedItems: 'Passwords',
      onSuccess: loadPasswords,
    };
    const totpConfig = { type: 'totp', importedItems: 'Codes', onSuccess: loadCodes };
    const tokensConfig = { type: 'token', importedItems: 'Tokens', onSuccess: loadTokens };

    const dataConfig = {
      importedItems: 'Data',
      onSuccess: async () => {
        await Promise.all([loadPasswords(true), loadCodes(true), loadTokens(true)]);
      },
    };

    const systemCommands = [
      {
        id: 'open-passwords',
        label: 'Open passwords',
        hint: 'Screens',
        icon: 'command',
        type: 'Command',
        action: () => setScreen('passwords'),
      },
      {
        id: 'open-codes',
        label: 'Open codes',
        hint: 'Screens',
        icon: 'command',
        type: 'Command',
        action: () => setScreen('totp'),
      },
      {
        id: 'open-tokens',
        label: 'Open tokens',
        hint: 'Screens',
        icon: 'command',
        type: 'Command',
        action: () => setScreen('tokens'),
      },
      {
        id: 'open-settings',
        label: 'Open settings',
        hint: 'Screens',
        icon: 'command',
        type: 'Command',
        action: () => runWithVerification(() => setScreen('settings')),
      },

      {
        id: 'add-password',
        label: 'Add password',
        hint: 'Passwords',
        icon: 'command',
        type: 'Command',
        action: openAddPassword,
      },
      {
        id: 'import-passwords',
        label: 'Import passwords',
        hint: 'Passwords',
        icon: 'command',
        type: 'Command',
        action: () => runWithVerification(() => openDataManagement(passwordsConfig)),
      },
      {
        id: 'export-passwords',
        label: 'Export passwords',
        hint: 'Passwords',
        icon: 'command',
        type: 'Command',
        action: () =>
          runWithVerification(() => openDataManagement({ ...passwordsConfig, mode: 'export' })),
      },

      {
        id: 'add-code',
        label: 'Add code',
        hint: 'Codes',
        icon: 'command',
        type: 'Command',
        action: openAddCode,
      },
      {
        id: 'import-codes',
        label: 'Import codes',
        hint: 'Codes',
        icon: 'command',
        type: 'Command',
        action: () => runWithVerification(() => openDataManagement(totpConfig)),
      },
      {
        id: 'export-codes',
        label: 'Export codes',
        hint: 'Codes',
        icon: 'command',
        type: 'Command',
        action: () =>
          runWithVerification(() => openDataManagement({ ...totpConfig, mode: 'export' })),
      },

      {
        id: 'add-token',
        label: 'Add token',
        hint: 'Tokens',
        icon: 'command',
        type: 'Command',
        action: openAddToken,
      },
      {
        id: 'import-tokens',
        label: 'Import tokens',
        hint: 'Tokens',
        icon: 'command',
        type: 'Command',
        action: () => runWithVerification(() => openDataManagement(tokensConfig)),
      },
      {
        id: 'export-tokens',
        label: 'Export tokens',
        hint: 'Tokens',
        icon: 'command',
        type: 'Command',
        action: () =>
          runWithVerification(() => openDataManagement({ ...tokensConfig, mode: 'export' })),
      },

      {
        id: 'import-data',
        label: 'Import data',
        hint: 'General',
        icon: 'command',
        type: 'Command',
        action: () => runWithVerification(() => openDataManagement(dataConfig)),
      },
      {
        id: 'export-data',
        label: 'Export data',
        hint: 'General',
        icon: 'command',
        type: 'Command',
        action: () =>
          runWithVerification(() => openDataManagement({ ...dataConfig, mode: 'export' })),
      },
      {
        id: 'compact-database',
        label: 'Compact database',
        hint: 'General',
        icon: 'command',
        type: 'Command',
        action: () =>
          toast.promise(withDelay(compactDatabase()), {
            loading: 'Compacting database...',
            success: 'Database successfully compacted!',
            error: 'Compaction failed',
          }),
      },
      {
        id: 'open-plugins',
        label: 'Open plugins',
        hint: 'General',
        icon: 'command',
        type: 'Command',
        action: () => runWithVerification(openPlugins, { force: true }),
      },
      {
        id: 'sign-out',
        label: 'Sign out',
        hint: 'General',
        icon: 'command',
        type: 'Command',
        action: () =>
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
    ];

    const allCommands = [...systemCommands, ...dataItems];
    return Object.groupBy(allCommands, (command) => command.type);
  }, [dataItems]);

  const activeCommand = selectedId
    ? Object.values(groupedCommands)
        .flat()
        .find((command) => command.id === selectedId)
    : null;

  return {
    isCommandPaletteOpen,
    closeCommandPalette,
    groupedCommands,
    runAction,
    selectedId,
    setSelectedId,
    activeCommand,
  };
};
