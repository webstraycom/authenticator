import { useEffect, useMemo, useState } from 'react';
import { usePluginStore } from '@sdk';
import { useCodesStore, useUIStore } from '@store';
import { ClockIcon } from 'lucide-react';
import { Marker, MarkerContent } from '@ui/marker';
import { NoItemsPlaceholder } from '@common/no-items-placeholder';
import { CodeItem } from '@features/totp/code-item';
import { sorter } from '@utils/sorter';
import { ItemGroup } from '@ui/item';
import { ScreenFooter } from '@common/screen-footer';

export const TOTPScreen = () => {
  const openAdd = useUIStore((state) => state.openAddCode);
  const openDataManagement = useUIStore((state) => state.openDataManagement);
  const codes = useCodesStore((state) => state.codes);
  const loadCodes = useCodesStore((state) => state.loadCodes);
  const isLoading = useCodesStore((state) => state.isLoading);

  const runWithVerification = useUIStore((state) => state.runWithVerification);

  const slotActions = usePluginStore((state) => state.slots['totp-screen']);
  const pluginsCount = slotActions ? Object.keys(slotActions).length : 0;

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
      <div className="relative flex h-full w-full flex-col items-center">
        <ItemGroup className="flex flex-col items-center gap-4 p-8 scroll-fade scroll-fade-24 flex-1 overflow-y-auto">
          {activeCodes.map((item) => (
            <CodeItem key={item._id} item={item} tick={globalTick} />
          ))}
          {corruptedCodes.length > 0 && (
            <>
              <Marker variant="separator" className="max-w-xl text-xs py-4" aria-hidden="true">
                <MarkerContent>Corrupted Codes</MarkerContent>
              </Marker>
              {corruptedCodes.map((item) => (
                <CodeItem key={item._id} item={item} tick={globalTick} />
              ))}
            </>
          )}
        </ItemGroup>
        <ScreenFooter
          pluginsCount={pluginsCount}
          slotName="totp-screen"
          onImport={handleImport}
          onExport={handleExport}
          onAdd={openAdd}
          type="code"
        />
      </div>
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
