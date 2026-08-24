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
      <div className="flex flex-col flex-1">
        <div className='flex flex-col flex-1 gap-4 scroll-fade scroll-fade-24 overflow-y-auto w-full p-8'>
          <ItemGroup className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 content-start">
            {activePasswords.map((item) => (
              <PasswordItem key={item._id} item={item} />
            ))}
          </ItemGroup>
          {corruptedPasswords.length > 0 && (
            <>
              <Marker
                id="corrupted-password-heading"
                variant="separator"
                className="min-h-fit text-xs py-2"
                asChild
              >
                <h2>
                  <MarkerContent>Corrupted Passwords</MarkerContent>
                </h2>
              </Marker>
              <ItemGroup className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 content-start" aria-labelledby="corrupted-password-heading">
                {corruptedPasswords.map((item) => (
                  <PasswordItem key={item._id} item={item} />
                ))}
              </ItemGroup>
            </>
          )}
        </div>
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
