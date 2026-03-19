import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@ui/Command';
import { useCommandPalette } from '@hooks/useCommandPalette';
import {
  ArrowLeftIcon,
  BoltIcon,
  ClockIcon,
  CogIcon,
  DownloadIcon,
  KeyRoundIcon,
  LockIcon,
  PackageIcon,
  PlusIcon,
  UploadIcon,
} from 'lucide-react';

export const CommandPaletteDialog = () => {
  const { isOpen, closeCommandPalette, execute, actions } = useCommandPalette();

  return (
    <div className="flex flex-col gap-4">
      <CommandDialog
        open={isOpen}
        onOpenChange={(open) => !open && closeCommandPalette()}
        className="sm:max-w-[350px]"
      >
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty className="text-muted-foreground">No results found.</CommandEmpty>
            <CommandGroup heading="Screens">
              <CommandItem onSelect={() => execute(actions.screens.openPasswords)}>
                <LockIcon />
                Open passwords
              </CommandItem>
              <CommandItem onSelect={() => execute(actions.screens.openCodes)}>
                <ClockIcon />
                Open codes
              </CommandItem>
              <CommandItem onSelect={() => execute(actions.screens.openTokens)}>
                <KeyRoundIcon />
                Open tokens
              </CommandItem>
              <CommandItem onSelect={() => execute(actions.screens.openSettings)}>
                <CogIcon />
                Open settings
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Passwords">
              <CommandItem onSelect={() => execute(actions.passwords.addPassword)}>
                <PlusIcon />
                Add password
              </CommandItem>
              <CommandItem onSelect={() => execute(actions.passwords.importPasswords)}>
                <DownloadIcon />
                Import passwords
              </CommandItem>
              <CommandItem onSelect={() => execute(actions.passwords.exportPasswords)}>
                <UploadIcon />
                Export passwords
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Codes">
              <CommandItem onSelect={() => execute(actions.codes.addCode)}>
                <PlusIcon />
                Add code
              </CommandItem>
              <CommandItem onSelect={() => execute(actions.codes.importCodes)}>
                <DownloadIcon />
                Import codes
              </CommandItem>
              <CommandItem onSelect={() => execute(actions.codes.exportCodes)}>
                <UploadIcon />
                Export codes
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Tokens">
              <CommandItem onSelect={() => execute(actions.tokens.addToken)}>
                <PlusIcon />
                Add token
              </CommandItem>
              <CommandItem onSelect={() => execute(actions.tokens.importTokens)}>
                <DownloadIcon />
                Import tokens
              </CommandItem>
              <CommandItem onSelect={() => execute(actions.tokens.exportTokens)}>
                <UploadIcon />
                Export tokens
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="General">
              <CommandItem onSelect={() => execute(actions.general.importData)}>
                <DownloadIcon />
                Import data
              </CommandItem>
              <CommandItem onSelect={() => execute(actions.general.exportData)}>
                <UploadIcon />
                Export data
              </CommandItem>
              <CommandItem onSelect={() => execute(actions.general.compactDatabase)}>
                <BoltIcon />
                Compact database
              </CommandItem>
              <CommandItem onSelect={() => execute(actions.general.openPlugins)}>
                <PackageIcon />
                Open plugins
              </CommandItem>
              <CommandItem onSelect={() => execute(actions.general.signOut)}>
                <ArrowLeftIcon />
                Sign out
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
};
