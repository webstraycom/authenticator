import { Button } from '@ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu';
import { PlusIcon } from 'lucide-react';
import { Slot } from '@sdk/plugin-system';
import { useState } from 'react';
import { useShortcut } from '@hooks/use-shortcut';

export const ScreenFooter = ({ pluginsCount, slotName, onImport, onExport, onAdd, type }) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isPluginsOpen, setIsPluginsOpen] = useState(false);

  useShortcut('ctrl+o', () => setIsOptionsOpen(open => !open));
  useShortcut('ctrl+p', () => setIsPluginsOpen(open => !open));
  useShortcut('ctrl+n', () => onAdd());

  return (
    <div className="flex w-full justify-center p-8">
      <div className="flex w-full justify-between">
        {pluginsCount > 0 && (
          <DropdownMenu open={isPluginsOpen} onOpenChange={setIsPluginsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" aria-label="Open plugins menu" aria-keyshortcuts="Control+p">
                Plugins ({pluginsCount})
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-fit" align="start">
              <DropdownMenuLabel>Plugins</DropdownMenuLabel>
              <DropdownMenuGroup>
                <Slot slotName={slotName} />
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <div className="flex items-center gap-2 ml-auto">
          <DropdownMenu open={isOptionsOpen} onOpenChange={setIsOptionsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" aria-label={`Open ${type} options menu`} aria-keyshortcuts="Control+o">
                Options
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={onImport}>Import</DropdownMenuItem>
                <DropdownMenuItem onSelect={onExport}>Export</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={onAdd} className="gap-1" aria-keyshortcuts="Control+n">
            <PlusIcon />
            Add New
          </Button>
        </div>
      </div>
    </div>
  )
}