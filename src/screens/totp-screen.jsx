import { useEffect, useMemo, useState } from 'react';
import { usePluginStore } from '@sdk';
import { useCodesStore, useUIStore } from '@store';
import { ClockIcon, PlusIcon } from 'lucide-react';
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
import { CodeItem } from '@features/totp/code-item';
import { sorter } from '@utils/sorter';
import { Slot } from '@sdk/plugin-system';

export const TOTPScreen = () => {
  const openAdd = useUIStore((state) => state.openAddCode);
  const openDataManagement = useUIStore((state) => state.openDataManagement);
  const codes = useCodesStore((state) => state.codes);
  const loadCodes = useCodesStore((state) => state.loadCodes);
  const isLoading = useCodesStore((state) => state.isLoading);

  const runWithVerification = useUIStore((state) => state.runWithVerification);

  const slotActions = usePluginStore((state) => state.slots['totp-screen']);
  const activeInSlotCount = slotActions ? Object.keys(slotActions).length : 0;

  useEffect(() => {
    loadCodes();
  }, [loadCodes]);

  const { activeCodes, corruptedCodes } = useMemo(() => {
    const sortedCodes = [...codes].sort(sorter);

    return sortedCodes.reduce(
      (acc, item) => {
        if (item.isCorrupted) {
          acc.corruptedCodes.push(item);
        } else {
          acc.activeCodes.push(item);
        }
        return acc;
      },
      { activeCodes: [], corruptedCodes: [] },
    );
  }, [codes]);

  const [globalTick, setGlobalTick] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setGlobalTick(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const baseConfig = {
    type: 'totp',
    importedItems: 'Codes',
    onSuccess: () => loadCodes(),
  };

  const handleImport = () => runWithVerification(() => openDataManagement(baseConfig));

  const handleExport = () =>
    runWithVerification(() => openDataManagement({ ...baseConfig, mode: 'export' }));

  if (isLoading) {
    return null;
  }

  if (codes.length > 0) {
    return (
      <section className="relative flex h-full w-full flex-col items-center">
        <div className="scroll-fade scroll-fade-24 w-full flex-1 overflow-y-auto">
          <div className="flex w-full flex-col items-center gap-4 p-8">
            {activeCodes.map((item) => (
              <CodeItem key={item._id} item={item} tick={globalTick} />
            ))}
            {corruptedCodes.length > 0 && (
              <>
                <Marker variant="separator" className="max-w-xl">
                  <MarkerContent className="py-2 text-xs">Corrupted Passwords</MarkerContent>
                </Marker>
                {corruptedCodes.map((item) => (
                  <CodeItem key={item._id} item={item} tick={globalTick} />
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
                    <Slot slotName="totp-screen" />
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
                <PlusIcon className="black size-3.5" />
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
        icon: <ClockIcon />,
        header: 'No Codes Yet',
        description: `You haven't added any codes yet. Get started by adding your first code.`,
        buttonText: 'Add Code',
      }}
    />
  );
};
