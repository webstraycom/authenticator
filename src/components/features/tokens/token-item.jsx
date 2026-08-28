import { KeyRoundIcon } from 'lucide-react';
import { Badge } from '@ui/badge';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@ui/item';
import { ItemActionsMenu } from '@common/item-actions-menu';
import { SensitiveValue } from '@common/sensitive-value';
import { CorruptedItem } from '@features/corrupted-item';
import { useTokensStore, useUIStore } from '@store';
import { useSensitiveData } from '@hooks/use-sensitive-data';

const getStatus = (expires) => {
  if (!expires) return { label: 'Unsecure', isWarning: true };

  const diffTime = new Date(expires) - new Date();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffTime <= 0) return { label: 'Expired', isCritical: true };

  const label = `${diffDays} ${diffDays === 1 ? 'day' : 'days'} left`;
  return { label, isWarning: false };
};

export const TokenItem = ({ item }) => {
  const openEdit = useUIStore((state) => state.openEditToken);
  const openConfirm = useUIStore((state) => state.openConfirm);

  const deleteToken = useTokensStore((state) => state.deleteToken);

  const runWithVerification = useUIStore((state) => state.runWithVerification);

  const { isVisible, show, copy } = useSensitiveData(item.value, 'Token');

  const handleEdit = () => {
    runWithVerification(() => {
      openEdit(item);
    });
  };

  const handleDelete = () => {
    openConfirm({
      description: (
        <>
          This action cannot be undone. This will permanently delete the{' '}
          <strong>{item?.service}</strong> entry from your vault.
        </>
      ),
      buttonText: 'Delete',
      onConfirm: async () => await deleteToken(item._id),
    });
  };

  const status = getStatus(item.expires);

  if (item.isCorrupted) {
    return <CorruptedItem type="Token" service={item.service} onDelete={handleDelete} />;
  }

  return (
    <Item variant="outline" className="dark:bg-muted/30 w-full gap-2.5">
      <ItemMedia variant="icon" className="bg-muted">
        <KeyRoundIcon />
      </ItemMedia>
      <ItemContent className="gap-0">
        <div className="flex flex-row items-center gap-1">
          <ItemTitle>
            <span className="truncate">{item.service}</span>
          </ItemTitle>
          <Badge
            variant={status.isCritical ? 'destructive' : status.isWarning ? 'outline' : 'secondary'}
          >
            {status.label}
          </Badge>
        </div>
        <ItemDescription className="text-muted-foreground text-xs">{item.endpoint}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <SensitiveValue value={item.value} isVisible={isVisible} onCopy={copy} type="token" />
        <ItemActionsMenu
          service={item.service}
          onShow={show}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </ItemActions>
    </Item>
  );
};
