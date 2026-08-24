import { Button } from '@ui/button';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia } from '@ui/item';
import { CircleAlertIcon, Trash2Icon } from 'lucide-react';

export const CorruptedItem = ({ type, service, onDelete }) => (
  <Item
    variant="outline"
    className="dark:bg-muted/30 w-full gap-2.5 opacity-50"
  >
    <ItemMedia variant="icon" className="bg-muted">
      <CircleAlertIcon />
    </ItemMedia>
    <ItemContent className="gap-0">
      <ItemDescription className="text-muted-foreground pt-1 text-xs">
        {type} for <strong>{service}</strong> is corrupted and cannot be read.
      </ItemDescription>
    </ItemContent>
    <ItemActions>
      <Button
        variant="outline"
        size="icon-sm"
        onClick={onDelete}
        aria-label="Delete corrupted token"
      >
        <Trash2Icon />
      </Button>
    </ItemActions>
  </Item>
);