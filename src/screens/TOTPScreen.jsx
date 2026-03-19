import React, { useState, useEffect, useMemo } from 'react';
import { ClockIcon, PlusIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@ui/DropdownMenu';
import { Button } from '@ui/Button';
import { CodeItem } from '@features/totp/CodeItem';
import { NoItemsPlaceholder } from '@common/NoItemsPlaceholder';
import { sorter } from '@utils/sorter';
import { useUIStore, useCodesStore } from '@store';
import { usePluginStore } from '@sdk';
import { Slot } from '@sdk/PluginSystem';

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
        <div className="w-full flex-1 overflow-y-auto [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]">
          <div className="flex w-full flex-col items-center gap-4 p-8">
            {activeCodes.map((item) => (
              <CodeItem key={item._id} item={item} tick={globalTick} />
            ))}
            {corruptedCodes.length > 0 && (
              <>
                <div className="flex w-full max-w-xl items-center gap-4 py-2">
                  <div className="bg-border/60 h-px flex-1"></div>
                  <span className="text-muted-foreground text-xs">Corrupted Codes</span>
                  <div className="bg-border/60 h-px flex-1"></div>
                </div>
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
