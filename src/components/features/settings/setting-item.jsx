import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@ui/item';

export const SettingsItem = ({ icon: Icon, title, description, children }) => (
  <Item variant="outline" className="dark:bg-muted/30 w-full gap-2.5">
    <ItemMedia variant="icon" className="bg-muted">
      <Icon />
    </ItemMedia>
    <ItemContent className="gap-0">
      <ItemTitle><span className='truncate'>{title}</span></ItemTitle>
      <ItemDescription className="text-muted-foreground text-xs">{description}</ItemDescription>
    </ItemContent>
    <ItemActions>{children}</ItemActions>
  </Item>
);
