import { memo } from 'react';
import { ClockIcon, MoreHorizontalIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react'; // eslint-disable-line no-unused-vars
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
import { CorruptedItem } from '@features/corrupted-item';
import { useCodesStore, useUIStore } from '@store';
import { useTOTP } from '@hooks/use-totp';

const TotpCodeItem = ({ token, isExpiring, service, onCopy }) => (
  <button
    type="button"
    onClick={onCopy}
    className={`group focus-visible:bg-secondary modern:dark:focus-visible:border-ring/30 focus-visible:ring-ring/50 focus-visible:border-ring flex items-center gap-1 rounded-md border border-transparent transition-all duration-200 outline-none focus-visible:ring-3 active:scale-90 ${isExpiring ? 'will-change-opacity animate-pulse' : ''} `}
    aria-label={`Copy code for ${service}`}
  >
    <span className="sr-only">{token}</span>
    <div className="flex items-center gap-1" aria-hidden="true">
      {[...token].map((char, index) => (
        <span
          key={index}
          className={`bg-secondary group-hover:group-not-focus-visible:bg-secondary/80 relative flex h-6 w-6 items-center justify-center overflow-hidden rounded-sm font-mono text-sm font-medium transition-all ${index === 2 ? 'mr-1.5' : ''}`}
        >
          <AnimatePresence>
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
      ))}
    </div>
  </button>
);

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
        onConfirm: async () => await deleteCode(item._id),
      });
    };

    if (item.isCorrupted) {
      return <CorruptedItem type="Code" service={item.service} onDelete={handleDelete} />;
    }

    return (
      <Item variant="outline" className="dark:bg-muted/30 w-full gap-2.5">
        <ItemMedia variant="icon" className="bg-muted">
          <ClockIcon />
        </ItemMedia>
        <ItemContent className="gap-0">
          <ItemTitle>
            <span className="truncate">{item.service}</span>
          </ItemTitle>
          <ItemDescription className="text-muted-foreground text-xs">
            {item.account}
          </ItemDescription>
        </ItemContent>
        <ItemActions className="gap-2.5">
          <TotpCodeItem
            token={token}
            isExpiring={isExpiring}
            service={item.service}
            onCopy={handleCopy}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label={`Open actions menu for ${item.service}`}
              >
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuGroup>
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
