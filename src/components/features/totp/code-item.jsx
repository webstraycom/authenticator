import { Fragment, memo } from 'react';
import { useCodesStore, useUIStore } from '@store';
import { CircleAlertIcon, ClockIcon, MoreHorizontalIcon, Trash2Icon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { toast } from 'sonner';
import { Button } from '@ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@ui/item';
import { useTOTP } from '@hooks/use-totp';

export const CodeItem = memo(
  ({ item, tick }) => {
    const { token, isExpiring } = useTOTP(item.value, tick);

    const openEdit = useUIStore((state) => state.openEditCode);
    const openConfirm = useUIStore((state) => state.openConfirm);
    const deleteCode = useCodesStore((state) => state.deleteCode);
    const runWithVerification = useUIStore((state) => state.runWithVerification);

    const handleCopy = () => {
      navigator.clipboard.writeText(token);
      toast.success('Code has been copied to clipboard!');
    };

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
            <strong>{item?.service}</strong> entry from your vault.
          </>
        ),
        onConfirm: async () => await deleteCode(item._id),
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
              Code for <strong>{item.service}</strong> is corrupted and cannot be read.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button
              variant="outline"
              onClick={() => handleDelete(item)}
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
          <ClockIcon className="text-foreground size-4" />
        </ItemMedia>
        <ItemContent className="gap-0">
          <ItemTitle>{item.service}</ItemTitle>
          <ItemDescription className="text-muted-foreground text-xs">
            {item.account}
          </ItemDescription>
        </ItemContent>
        <ItemActions className="gap-2.5">
          <div
            tabIndex={0}
            onClick={handleCopy}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCopy();
              }
            }}
            className={`group focus-visible:bg-accent ring-offset-background flex cursor-pointer items-center gap-1 rounded transition duration-200 outline-none select-none focus-visible:ring-4 focus-visible:ring-neutral-300 active:scale-90 dark:focus-visible:ring-neutral-700 ${isExpiring ? 'will-change-opacity animate-pulse' : ''} `}
          >
            {token.split('').map((char, index) => (
              <Fragment key={index}>
                <span className="bg-accent relative flex h-6 w-6 items-center justify-center overflow-hidden rounded-sm font-mono text-sm font-medium transition-all group-hover:bg-neutral-200 dark:bg-neutral-800 dark:group-hover:bg-neutral-700">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={`${index}-${token}`}
                      initial={{ y: '100%' }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: '-100%' }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 20,
                        delay: index * 0.05,
                      }}
                      className="absolute inset-0 flex items-center justify-center text-sm font-medium will-change-transform"
                    >
                      {char}
                    </motion.span>
                  </AnimatePresence>
                </span>
                {index === 2 && <div className="w-0.5" />}
              </Fragment>
            ))}
          </div>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" aria-label="Open menu" size="icon-sm" className="size-7">
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuGroup>
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
  },
  (prev, next) => {
    if (prev.item._id !== next.item._id) return false;

    if (
      prev.item.value !== next.item.value ||
      prev.item.service !== next.item.service ||
      prev.item.account !== next.item.account
    ) {
      return false;
    }

    const getRemaining = (t) => 30 - (Math.floor(t / 1000) % 30);
    const prevLeft = getRemaining(prev.tick);
    const nextLeft = getRemaining(next.tick);

    if (nextLeft === 30) return false;

    const wasExpiring = prevLeft <= 5;
    const isNowExpiring = nextLeft <= 5;
    if (wasExpiring !== isNowExpiring) return false;

    return Math.floor(prev.tick / 1000) === Math.floor(next.tick / 1000);
  },
);
