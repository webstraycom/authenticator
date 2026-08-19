import { Fragment, memo } from 'react';
import { ClockIcon, CommandIcon, CornerDownLeft, KeyRoundIcon, LockIcon } from 'lucide-react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandType,
} from '@ui/command';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@ui/empty';
import { Kbd } from '@ui/kbd';
import { useCommandPalette } from '@hooks/use-command-palette';

const ICON_MAP = {
  command: CommandIcon,
  password: LockIcon,
  code: ClockIcon,
  token: KeyRoundIcon,
};

const CommandPaletteItemContent = memo(
  ({ command }) => {
    const CommandItemIcon = ICON_MAP[command.icon] || CommandIcon;

    return (
      <div className="flex min-w-0 items-center gap-2">
        <div
          aria-hidden="true"
          className="bg-muted group-data-selected/command-item:bg-foreground/5 dark:group-data-selected/command-item:bg-foreground/10 flex size-6 shrink-0 items-center justify-center rounded-md"
        >
          <CommandItemIcon className="size-4" />
        </div>
        <div className="flex min-w-0 items-baseline gap-2">
          <span className="max-w-48 truncate leading-none font-medium">{command.label}</span>
          <span className="text-muted-foreground truncate text-xs/none">{command.hint}</span>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.command.id === nextProps.command.id,
);

export const CommandPaletteDialog = () => {
  const {
    isCommandPaletteOpen,
    closeCommandPalette,
    groupedCommands,
    runAction,
    selectedId,
    setSelectedId,
    activeCommand,
  } = useCommandPalette();

  const commandGroups = Object.entries(groupedCommands);

  return (
    <CommandDialog
      open={isCommandPaletteOpen}
      onOpenChange={(open) => !open && closeCommandPalette()}
      className="sm:max-w-[450px]"
    >
      <Command value={selectedId} onValueChange={setSelectedId}>
        <CommandInput placeholder="Search commands and secrets..." />
        <CommandList>
          <CommandEmpty>
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <CommandIcon />
                </EmptyMedia>
                <EmptyTitle>No results found</EmptyTitle>
                <EmptyDescription className="leading-normal">
                  No matches found for this query. Check your spelling and try again.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CommandEmpty>
          {commandGroups.map(([type, items], groupIndex) => {
            const isLastGroup = groupIndex === commandGroups.length - 1;
            return (
              <Fragment key={type}>
                <CommandGroup heading={`${type}s`}>
                  {items.map((command) => (
                    <CommandItem
                      key={command.id}
                      value={command.id}
                      keywords={[command.label, command.hint, command.type]}
                      onSelect={() => runAction(command.action)}
                    >
                      <CommandPaletteItemContent command={command} />
                      <CommandType>{command.type}</CommandType>
                    </CommandItem>
                  ))}
                </CommandGroup>
                {!isLastGroup && <CommandSeparator />}
              </Fragment>
            );
          })}
        </CommandList>
        <CommandFooter aria-hidden="true" className="h-12 px-4">
          <div className="text-muted-foreground flex w-full items-center justify-start gap-2 text-xs">
            <Kbd className="bg-background/50 border dark:border-none">
              <CornerDownLeft />
            </Kbd>
            <span>
              {!activeCommand || activeCommand.type === 'Command' ? 'Run' : 'Copy'}{' '}
              <span className="font-medium">{activeCommand ? activeCommand.type : 'Command'}</span>
            </span>
          </div>
        </CommandFooter>
      </Command>
    </CommandDialog>
  );
};
