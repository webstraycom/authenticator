import { LockIcon } from 'lucide-react';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@ui/item';
import { ItemActionsMenu } from '@common/item-actions-menu';
import { SensitiveValue } from '@common/sensitive-value';
import { CorruptedItem } from '@features/corrupted-item';
import { usePasswordsStore, useUIStore } from '@store';
import { useSensitiveData } from '@hooks/use-sensitive-data';

export const PasswordItem = ({ item }) => {
  const openEdit = useUIStore((state) => state.openEditPassword);
  const openConfirm = useUIStore((state) => state.openConfirm);

  const deletePassword = usePasswordsStore((state) => state.deletePassword);

  const runWithVerification = useUIStore((state) => state.runWithVerification);

  const { isVisible, show, copy } = useSensitiveData(item.value, 'Password');

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
          <strong>{item?.site}</strong> entry from your vault.
        </>
      ),
      buttonText: 'Delete',
      onConfirm: async () => await deletePassword(item._id),
    });
  };

  if (item.isCorrupted) {
    return <CorruptedItem type="Password" service={item.site} onDelete={handleDelete} />;
  }

  return (
    <Item variant="outline" className="dark:bg-muted/30 w-full gap-2.5">
      <ItemMedia variant="icon" className="bg-muted">
        <LockIcon />
      </ItemMedia>
      <ItemContent className="gap-0">
        <ItemTitle>
          <span className="truncate">{item.site}</span>
        </ItemTitle>
        <ItemDescription className="text-muted-foreground text-xs">{item.login}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <SensitiveValue value={item.value} isVisible={isVisible} onCopy={copy} type="password" />
        <ItemActionsMenu
          service={item.site}
          onShow={show}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </ItemActions>
    </Item>
  );
};
