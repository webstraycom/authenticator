import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@ui/item';

export const SettingsItem = ({ icon: Icon, title, description, children }) => (
  <Item
    variant="outline"
    className="dark:bg-muted/30 w-full max-w-xl gap-2.5 transition-all"
  >
    <ItemMedia variant="icon" className="bg-accent border-none">
      <Icon size={20} />
    </ItemMedia>
    <ItemContent className="gap-0">
      <ItemTitle>{title}</ItemTitle>
      <ItemDescription className="text-muted-foreground text-xs">{description}</ItemDescription>
    </ItemContent>
    <ItemActions>{children}</ItemActions>
  </Item>
);
