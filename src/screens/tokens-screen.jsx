import { useEffect, useMemo } from 'react';
import { usePluginStore } from '@sdk';
import { useTokensStore, useUIStore } from '@store';
import { KeyRoundIcon, PlusIcon } from 'lucide-react';
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
import { TokenItem } from '@features/tokens/token-item';
import { sorter } from '@utils/sorter';
import { Slot } from '@sdk/plugin-system';
import { ItemGroup } from '@ui/item';

export const TokensScreen = () => {
  const openAdd = useUIStore((state) => state.openAddToken);
  const openDataManagement = useUIStore((state) => state.openDataManagement);
  const tokens = useTokensStore((state) => state.tokens);
  const loadTokens = useTokensStore((state) => state.loadTokens);
  const isLoading = useTokensStore((state) => state.isLoading);

  const runWithVerification = useUIStore((state) => state.runWithVerification);

  const slotActions = usePluginStore((state) => state.slots['tokens-screen']);
  const activeInSlotCount = slotActions ? Object.keys(slotActions).length : 0;

  useEffect(() => {
    loadTokens();
  }, [loadTokens]);

  const { activeTokens, expiredTokens, corruptedTokens } = useMemo(() => {
    const now = new Date();
    const sortedTokens = [...tokens].sort(sorter);

    return sortedTokens.reduce(
      (acc, token) => {
        if (token.isCorrupted) {
          acc.corruptedTokens.push(token);
        } else {
          const isExpired = token.expires && new Date(token.expires) <= now;
          isExpired ? acc.expiredTokens.push(token) : acc.activeTokens.push(token);
        }
        return acc;
      },
      { activeTokens: [], expiredTokens: [], corruptedTokens: [] },
    );
  }, [tokens]);

  const baseConfig = {
    type: 'token',
    importedItems: 'Tokens',
    onSuccess: () => loadTokens(),
  };

  const handleImport = () => runWithVerification(() => openDataManagement(baseConfig));

  const handleExport = () =>
    runWithVerification(() => openDataManagement({ ...baseConfig, mode: 'export' }));

  if (isLoading) {
    return null;
  }

  if (tokens.length > 0) {
    return (
      <div className="relative flex h-full w-full flex-col items-center">
        <ItemGroup className="flex flex-col items-center gap-4 p-8 scroll-fade scroll-fade-24 flex-1 overflow-y-auto">
          {activeTokens.map((item) => (
            <TokenItem key={item._id} item={item} />
          ))}
          {expiredTokens.length > 0 && (
            <>
              <Marker variant="separator" className="max-w-xl text-xs py-4" aria-hidden="true">
                <MarkerContent>Expired Tokens</MarkerContent>
              </Marker>
              {expiredTokens.map((item) => (
                <TokenItem key={item._id} item={item} />
              ))}
            </>
          )}
          {corruptedTokens.length > 0 && (
            <>
              <Marker variant="separator" className="max-w-xl text-xs py-4" aria-hidden="true">
                <MarkerContent>Corrupted Tokens</MarkerContent>
              </Marker>
              {corruptedTokens.map((item) => (
                <TokenItem key={item._id} item={item} />
              ))}
            </>
          )}
        </ItemGroup>
        <div className="flex w-full justify-center p-8">
          <div className="flex w-full max-w-xl justify-between">
            {activeInSlotCount > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" aria-label="Open plugins menu">
                    Plugins ({activeInSlotCount})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-fit" align="start">
                  <DropdownMenuLabel>Plugins</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <Slot slotName="tokens-screen" />
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" aria-label="Open token options menu">
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
                <PlusIcon />
                Add New
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <NoItemsPlaceholder
      onAdd={openAdd}
      onImport={handleImport}
      options={{
        icon: <KeyRoundIcon />,
        header: 'No Tokens Yet',
        description: `You haven't added any tokens yet. Get started by adding your first token.`,
        buttonText: 'Add Token',
      }}
    />
  );
};
