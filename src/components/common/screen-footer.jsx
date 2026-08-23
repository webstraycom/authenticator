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

export const ScreenFooter = ({ pluginsCount, slotName, onImport, onExport, onAdd, type }) => {
  return (
    <div className="flex w-full justify-center p-8">
      <div className="flex w-full justify-between">
        {pluginsCount > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" aria-label="Open plugins menu">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" aria-label={`Open ${type} options menu`}>
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
          <Button onClick={onAdd} className="gap-1">
            <PlusIcon />
            Add New
          </Button>
        </div>
      </div>
    </div>
  )
}