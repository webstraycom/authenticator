import { usePasswordsStore, useUIStore } from '@store';
import { CircleAlertIcon, LockIcon, MoreHorizontalIcon, Trash2Icon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
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

export const PasswordItem = ({ item }) => {
  const openEdit = useUIStore((state) => state.openEditPassword);
  const openConfirm = useUIStore((state) => state.openConfirm);

  const deletePassword = usePasswordsStore((state) => state.deletePassword);

  const runWithVerification = useUIStore((state) => state.runWithVerification);

  const { isVisible, show, copy } = useSensitiveData(item.value, 'Password');

  const handleEdit = (item) => {
    runWithVerification(() => {
      openEdit(item);
    });
  };

  const handleDelete = (item) => {
    openConfirm({
      description: (
        <>
          This action cannot be undone. This will permanently delete the{' '}
          <strong>{item?.site}</strong> entry from your vault.
        </>
      ),
      onConfirm: async () => await deletePassword(item._id),
    });
  };

  if (item.isCorrupted) {
    return (
      <Item
        variant="outline"
        className="dark:bg-muted/30 w-full max-w-xl gap-2.5 opacity-50 transition-all"
      >
        <ItemMedia variant="icon" className="bg-accent border-none">
          <CircleAlertIcon className="text-foreground size-4" />
        </ItemMedia>
        <ItemContent className="gap-0">
          <ItemDescription className="text-muted-foreground pt-1 text-xs">
            Password for <strong>{item.site}</strong> is corrupted and cannot be read.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button
            variant="outline"
            onClick={() => {
              handleDelete(item);
            }}
            size="icon-sm"
            className="size-7"
          >
            <Trash2Icon />
          </Button>
        </ItemActions>
      </Item>
    );
  }

  return (
    <Item
      variant="outline"
      className="dark:bg-muted/30 w-full max-w-xl gap-2.5 transition-all"
    >
      <ItemMedia variant="icon" className="bg-accent border-none">
        <LockIcon className="text-foreground size-4" />
      </ItemMedia>
      <ItemContent className="gap-0">
        <ItemTitle>{item.site}</ItemTitle>
        <ItemDescription className="text-muted-foreground text-xs">{item.login}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <code
          tabIndex={isVisible ? 0 : -1}
          onClick={copy}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              copy();
            }
          }}
          className={`bg-accent relative flex max-w-50 min-w-[80px] items-center justify-center overflow-hidden rounded-md px-2 py-1 text-xs transition-all duration-200 outline-none focus-visible:ring-4 focus-visible:ring-neutral-300 dark:bg-neutral-800 dark:focus-visible:ring-neutral-700 ${isVisible ? 'w-fit cursor-pointer font-mono hover:bg-neutral-200 active:scale-90 dark:hover:bg-neutral-700' : 'font-masked w-[80px] cursor-default'} `}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={isVisible ? 'pass' : 'dots'}
              initial={{ opacity: 0, y: 5, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -5, filter: 'blur(4px)' }}
              transition={{ duration: 0.3 }}
              className="inline-block whitespace-nowrap select-none"
            >
              {isVisible
                ? item.value.length > 20
                  ? `${item.value.slice(0, 20)}...`
                  : item.value
                : '••••••••'}
            </motion.span>
          </AnimatePresence>
        </code>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" aria-label="Open menu" size="icon-sm" className="size-7">
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={show}>Show</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => handleEdit(item)}>Edit</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleDelete(item)} variant="destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ItemActions>
    </Item>
  );
};
