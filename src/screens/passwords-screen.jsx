import { useEffect, useMemo } from 'react';
import { usePluginStore } from '@sdk';
import { usePasswordsStore, useUIStore } from '@store';
import { LockIcon, PlusIcon } from 'lucide-react';
import { Button } from '@ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu';
import { Marker, MarkerContent } from '@ui/marker';
import { NoItemsPlaceholder } from '@common/no-items-placeholder';
import { PasswordItem } from '@features/passwords/password-item';
import { sorter } from '@utils/sorter';
import { Slot } from '@sdk/plugin-system';

export const PasswordsScreen = () => {
  const openAdd = useUIStore((state) => state.openAddPassword);
  const openDataManagement = useUIStore((state) => state.openDataManagement);
  const passwords = usePasswordsStore((state) => state.passwords);
  const loadPasswords = usePasswordsStore((state) => state.loadPasswords);
  const isLoading = usePasswordsStore((state) => state.isLoading);

  const runWithVerification = useUIStore((state) => state.runWithVerification);

  const slotActions = usePluginStore((state) => state.slots['passwords-screen']);
  const activeInSlotCount = slotActions ? Object.keys(slotActions).length : 0;

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
      <section className="relative flex h-full w-full flex-col items-center">
        <div className="scroll-fade scroll-fade-24 w-full flex-1 overflow-y-auto">
          <div className="flex w-full flex-col items-center gap-4 p-8">
            {activePasswords.map((item) => (
              <PasswordItem key={item._id} item={item} />
            ))}
            {corruptedPasswords.length > 0 && (
              <>
                <Marker variant="separator" className="max-w-xl">
                  <MarkerContent className="py-2 text-xs">Corrupted Passwords</MarkerContent>
                </Marker>
                {corruptedPasswords.map((item) => (
                  <PasswordItem key={item._id} item={item} />
                ))}
              </>
            )}
          </div>
        </div>
        <div className="flex w-full justify-center p-8">
          <div className="flex w-full max-w-xl justify-between">
            {activeInSlotCount > 0 ? (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button className="gap-1" variant="outline">
                    Plugins ({activeInSlotCount})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-fit" align="start">
                  <DropdownMenuLabel>Plugins</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <Slot slotName="passwords-screen" />
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div aria-hidden="true" />
            )}
            <div className="flex items-center gap-2">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button className="gap-1" variant="outline" aria-label="Open menu">
                    Options
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Options</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem onSelect={handleImport}>Import</DropdownMenuItem>
                    <DropdownMenuItem onSelect={handleExport}>Export</DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={openAdd} className="gap-1">
                <PlusIcon className="size-3.5" />
                Add New
              </Button>
            </div>
          </div>
        </div>
      </section>
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
