import { useEffect, useMemo } from 'react';
import { usePluginStore } from '@sdk';
import { usePasswordsStore, useUIStore } from '@store';
import { LockIcon } from 'lucide-react';
import { Marker, MarkerContent } from '@ui/marker';
import { NoItemsPlaceholder } from '@common/no-items-placeholder';
import { PasswordItem } from '@features/passwords/password-item';
import { sorter } from '@utils/sorter';
import { ItemGroup } from '@ui/item';
import { ScreenFooter } from '@common/screen-footer';

export const PasswordsScreen = () => {
  const openAdd = useUIStore((state) => state.openAddPassword);
  const openDataManagement = useUIStore((state) => state.openDataManagement);
  const passwords = usePasswordsStore((state) => state.passwords);
  const loadPasswords = usePasswordsStore((state) => state.loadPasswords);
  const isLoading = usePasswordsStore((state) => state.isLoading);

  const runWithVerification = useUIStore((state) => state.runWithVerification);

  const slotActions = usePluginStore((state) => state.slots['passwords-screen']);
  const pluginsCount = slotActions ? Object.keys(slotActions).length : 0;

  useEffect(() => {
    loadPasswords();
  }, [loadPasswords]);

  const { activePasswords, corruptedPasswords } = useMemo(() => {
    const sortedPasswords = [...passwords].sort(sorter);

    return sortedPasswords.reduce(
      (acc, item) => {
        if (item.isCorrupted) {
          acc.corruptedPasswords.push(item);
        } else {
          acc.activePasswords.push(item);
        }
        return acc;
      },
      { activePasswords: [], corruptedPasswords: [] },
    );
  }, [passwords]);

  const baseConfig = {
    type: 'password',
    importedItems: 'Passwords',
    onSuccess: () => loadPasswords(),
  };

  const handleImport = () => runWithVerification(() => openDataManagement(baseConfig));

  const handleExport = () =>
    runWithVerification(() => openDataManagement({ ...baseConfig, mode: 'export' }));

  if (isLoading) {
    return null;
  }

  if (passwords.length > 0) {
    return (
      <div className="relative flex h-full w-full flex-col items-center">
        <ItemGroup className="flex flex-col items-center gap-4 p-8 scroll-fade scroll-fade-24 flex-1 overflow-y-auto">
          {activePasswords.map((item) => (
            <PasswordItem key={item._id} item={item} />
          ))}
          {corruptedPasswords.length > 0 && (
            <>
              <Marker variant="separator" className="max-w-xl text-xs py-4" aria-hidden="true">
                <MarkerContent>Corrupted Passwords</MarkerContent>
              </Marker>
              {corruptedPasswords.map((item) => (
                <PasswordItem key={item._id} item={item} />
              ))}
            </>
          )}
        </ItemGroup>
        <ScreenFooter
          pluginsCount={pluginsCount}
          slotName="passwords-screen"
          onImport={handleImport}
          onExport={handleExport}
          onAdd={openAdd}
          type="password"
        />
      </div>
    );
  }

  return (
    <NoItemsPlaceholder
      onAdd={openAdd}
      onImport={handleImport}
      options={{
        icon: <LockIcon />,
        header: 'No Passwords Yet',
        description: `You haven't added any passwords yet. Get started by adding your first password.`,
        buttonText: 'Add Password',
      }}
    />
  );
};
