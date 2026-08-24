import { useEffect, useMemo } from 'react';
import { usePluginStore } from '@sdk';
import { useTokensStore, useUIStore } from '@store';
import { KeyRoundIcon } from 'lucide-react';
import { NoItemsPlaceholder } from '@common/no-items-placeholder';
import { TokenItem } from '@features/tokens/token-item';
import { sorter } from '@utils/sorter';
import { ItemGroup, ItemGroupHeader } from '@ui/item';
import { ScreenFooter } from '@common/screen-footer';

export const TokensScreen = () => {
  const openAdd = useUIStore((state) => state.openAddToken);
  const openDataManagement = useUIStore((state) => state.openDataManagement);
  const tokens = useTokensStore((state) => state.tokens);
  const loadTokens = useTokensStore((state) => state.loadTokens);
  const isLoading = useTokensStore((state) => state.isLoading);

  const runWithVerification = useUIStore((state) => state.runWithVerification);

  const slotActions = usePluginStore((state) => state.slots['tokens-screen']);
  const pluginsCount = slotActions ? Object.keys(slotActions).length : 0;

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
      <div className="flex flex-col flex-1">
        <div className='flex flex-col flex-1 gap-4 scroll-fade scroll-fade-24 overflow-y-auto w-full p-8'>
          <ItemGroup className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 content-start">
            {activeTokens.map((item) => (
              <TokenItem key={item._id} item={item} />
            ))}
          </ItemGroup>
          {expiredTokens.length > 0 && (
            <>
              <ItemGroupHeader id="expired-token-heading">
                Expired Tokens
              </ItemGroupHeader>
              <ItemGroup className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 content-start" aria-labelledby="expired-token-heading">
                {expiredTokens.map((item) => (
                  <TokenItem key={item._id} item={item} />
                ))}
              </ItemGroup>
            </>
          )}
          {corruptedTokens.length > 0 && (
            <>
              <ItemGroupHeader id="corrupted-token-heading">
                Corrupted Tokens
              </ItemGroupHeader>
              <ItemGroup className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 content-start" aria-labelledby="corrupted-token-heading">
                {corruptedTokens.map((item) => (
                  <TokenItem key={item._id} item={item} />
                ))}
              </ItemGroup>
            </>
          )}
        </div>
        <ScreenFooter
          pluginsCount={pluginsCount}
          slotName="tokens-screen"
          onImport={handleImport}
          onExport={handleExport}
          onAdd={openAdd}
          type="token"
        />
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
