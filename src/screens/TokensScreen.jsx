import React, { useEffect, useMemo } from 'react';
import { KeyRoundIcon, PlusIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@ui/DropdownMenu';
import { Button } from '@ui/Button';
import { NoItemsPlaceholder } from '@common/NoItemsPlaceholder';
import { TokenItem } from '@features/tokens/TokenItem';
import { useTokensStore, useUIStore } from '@store';
import { sorter } from '@utils/sorter';
import { usePluginStore } from '@sdk';
import { Slot } from '@sdk/PluginSystem';

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
      <section className="relative flex h-full w-full flex-col items-center">
        <div className="w-full flex-1 overflow-y-auto scroll-fade scroll-fade-24">
          <div className="flex w-full flex-col items-center gap-4 p-8">
            {activeTokens.map((item) => (
              <TokenItem key={item._id} item={item} />
            ))}
            {expiredTokens.length > 0 && (
              <>
                <div className="flex w-full max-w-xl items-center gap-4 py-2">
                  <div className="bg-border/60 h-px flex-1"></div>
                  <span className="text-muted-foreground text-xs">Expired Tokens</span>
                  <div className="bg-border/60 h-px flex-1"></div>
                </div>

                {expiredTokens.map((item) => (
                  <TokenItem key={item._id} item={item} />
                ))}
              </>
            )}
            {corruptedTokens.length > 0 && (
              <>
                <div className="flex w-full max-w-xl items-center gap-4 py-2">
                  <div className="bg-border/60 h-px flex-1"></div>
                  <span className="text-muted-foreground text-xs">Corrupted Tokens</span>
                  <div className="bg-border/60 h-px flex-1"></div>
                </div>

                {corruptedTokens.map((item) => (
                  <TokenItem key={item._id} item={item} />
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
                    <Slot slotName="tokens-screen" />
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
        icon: <KeyRoundIcon />,
        header: 'No Tokens Yet',
        description: `You haven't added any tokens yet. Get started by adding your first token.`,
        buttonText: 'Add Token',
      }}
    />
  );
};
