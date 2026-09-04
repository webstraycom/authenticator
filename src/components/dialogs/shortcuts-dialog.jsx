import { Button } from '@ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ui/dialog';
import { Kbd, KbdGroup } from '@ui/kbd';
import { useUIStore } from '@store';
import { useShortcut } from '@hooks/use-shortcut';

const shortcuts = [
  { action: 'Open shortcuts', keys: ['Ctrl', '/'] },
  { action: 'Open command palette', keys: ['Ctrl', 'K'] },
  { action: 'Search secrets', keys: ['Ctrl', 'F'] },
  { action: 'Add secret', keys: ['Ctrl', 'N'] },
  { action: 'Open options', keys: ['Ctrl', 'O'] },
  { action: 'Open plugins', keys: ['Ctrl', 'P'] },
  { action: 'Toggle sidebar', keys: ['Ctrl', 'B'] },
  { action: 'Open passwords', keys: ['Ctrl', '1'] },
  { action: 'Open codes', keys: ['Ctrl', '2'] },
  { action: 'Open tokens', keys: ['Ctrl', '3'] },
  { action: 'Open settings', keys: ['Ctrl', ','] },
  { action: 'Sign out', keys: ['Ctrl', 'L'] },
];

export const ShortcutsDialog = () => {
  const isShortcutsOpen = useUIStore((state) => state.isShortcutsOpen);
  const openShortcuts = useUIStore((state) => state.openShortcuts);
  const closeShortcuts = useUIStore((state) => state.closeShortcuts);

  const isOtherDialogOpen = () => {
    return document.querySelector('[role="dialog"]') && !isShortcutsOpen;
  };

  const toggleShortcuts = () => {
    isShortcutsOpen ? closeShortcuts() : openShortcuts();
  };

  useShortcut('ctrl+slash', toggleShortcuts, { disabled: isOtherDialogOpen });

  return (
    <Dialog open={isShortcutsOpen} onOpenChange={(open) => !open && closeShortcuts()}>
      <DialogContent className="sm:max-w-[350px]">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Quick reference for commonly used keyboard shortcuts.
          </DialogDescription>
        </DialogHeader>
        <ul
          tabIndex={0}
          className="scroll-fade scroll-fade-24 -mb-2 flex max-h-48 flex-col gap-2 overflow-y-auto pb-2 focus-visible:outline-none"
          role="region"
          aria-label="Shortcuts list"
        >
          {shortcuts.map((shortcut) => (
            <li key={shortcut.action} className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">{shortcut.action}</span>
              <KbdGroup className="flex gap-0.75">
                {shortcut.keys.map((key) => (
                  <Kbd key={key}>{key}</Kbd>
                ))}
              </KbdGroup>
            </li>
          ))}
        </ul>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
