import { useEffect, useMemo, useState } from 'react';
import { usePluginStore } from '@sdk';
import { useCodesStore, useUIStore } from '@store';
import { ClockIcon } from 'lucide-react';
import { NoItemsPlaceholder } from '@common/no-items-placeholder';
import { CodeItem } from '@features/totp/code-item';
import { sorter } from '@utils/sorter';
import { ItemGroup, ItemGroupHeader } from '@ui/item';
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
      <div className="flex flex-col flex-1">
        <div className='flex flex-col flex-1 gap-4 scroll-fade scroll-fade-24 overflow-y-auto w-full p-8'>
          <ItemGroup className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 content-start">
            {activeCodes.map((item) => (
              <CodeItem key={item._id} item={item} tick={globalTick} />
            ))}
          </ItemGroup>
          {corruptedCodes.length > 0 && (
            <>
              <ItemGroupHeader id="corrupted-code-heading">
                Corrupted Codes
              </ItemGroupHeader>
              <ItemGroup className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 content-start" aria-labelledby="corrupted-code-heading">
                {corruptedCodes.map((item) => (
                  <CodeItem key={item._id} item={item} tick={globalTick} />
                ))}
              </ItemGroup>
            </>
          )}
        </div>
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
