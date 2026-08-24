import { usePasswordsStore, useUIStore } from '@store';
import { CircleAlertIcon, LockIcon, MoreHorizontalIcon, Trash2Icon } from 'lucide-react';
import { Button } from '@ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@ui/item';
import { useSensitiveData } from '@hooks/use-sensitive-data';
import { SensitiveValue } from '@common/sensitive-value';

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
      buttonText: "Delete",
      onConfirm: async () => await deletePassword(item._id),
    });
  };

  if (item.isCorrupted) {
    return (
      <Item
        variant="outline"
        className="dark:bg-muted/30 w-full gap-2.5 opacity-50"
      >
        <ItemMedia variant="icon" className="bg-muted">
          <CircleAlertIcon />
        </ItemMedia>
        <ItemContent className="gap-0">
          <ItemDescription className="text-muted-foreground pt-1 text-xs">
            Password for <strong>{item.site}</strong> is corrupted and cannot be read.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={handleDelete}
            aria-label="Delete corrupted password"
          >
            <Trash2Icon />
          </Button>
        </ItemActions>
      </Item>
    );
  }

  return (
    <Item variant="outline" className="dark:bg-muted/30 w-full gap-2.5">
      <ItemMedia variant="icon" className="bg-muted">
        <LockIcon />
      </ItemMedia>
      <ItemContent className="gap-0">
        <ItemTitle><span className='truncate'>{item.site}</span></ItemTitle>
        <ItemDescription className="text-muted-foreground text-xs">{item.login}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <SensitiveValue
          value={item.value}
          isVisible={isVisible}
          onCopy={copy}
          type="password"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon-sm" aria-label={`Open actions menu for ${item.site}`}>
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={show}>Show</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleEdit}>Edit</DropdownMenuItem>
              <DropdownMenuItem onSelect={handleDelete} variant="destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ItemActions>
    </Item>
  );
};
