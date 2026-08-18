import { useUIStore } from '@store';
import { CircleAlertIcon } from 'lucide-react';
import { Badge } from '@ui/badge';
import { Button } from '@ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ui/dialog';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '@ui/field';
import { Switch } from '@ui/switch';
import { usePluginsLogic } from '@hooks/use-plugins-logic';
import { pluginManager } from '@sdk/plugin-manager';

const handleOpenPluginsFolder = () => {
  pluginManager.openPluginsFolder();
};

export const PluginsDialog = () => {
  const isPluginsOpen = useUIStore((state) => state.isPluginsOpen);
  const closePlugins = useUIStore((state) => state.closePlugins);

  const { installedPlugins, enabledPlugins, handleTogglePlugin } = usePluginsLogic();

  const sortedPlugins = [...installedPlugins].sort((a, b) =>
    (a.title || '').localeCompare(b.title || ''),
  );

  return (
    <Dialog open={isPluginsOpen} onOpenChange={(open) => !open && closePlugins()}>
      <DialogContent className="mt-5 sm:max-w-[350px]">
        <DialogHeader>
          <DialogTitle>Plugins</DialogTitle>
          <DialogDescription>
            Here you can enable and disable your plugins. Place your plugins in the{' '}
            <Button variant="link" onClick={handleOpenPluginsFolder} className="h-4 p-0">
              plugins
            </Button>{' '}
            folder, and they will appear in the list below.
          </DialogDescription>
        </DialogHeader>
        {sortedPlugins.length > 0 ? (
          <FieldGroup className="scroll-fade scroll-fade-24 -mb-2 max-h-54 gap-2 overflow-y-auto pb-2">
            {sortedPlugins.map((plugin) => (
              <FieldLabel key={plugin.id} htmlFor={plugin.id}>
                <Field orientation="horizontal">
                  <FieldContent>
                    <div className="flex gap-1">
                      <FieldTitle>{plugin.title}</FieldTitle>
                      <Badge variant="secondary" className="h-4 px-1.5 py-2 text-xs">
                        {plugin.version}
                      </Badge>
                    </div>
                    <FieldDescription>{plugin.description}</FieldDescription>
                  </FieldContent>
                  <Switch
                    id={plugin.id}
                    checked={enabledPlugins.includes(plugin.id)}
                    onCheckedChange={() => handleTogglePlugin(plugin.id)}
                  />
                </Field>
              </FieldLabel>
            ))}
          </FieldGroup>
        ) : (
          <div className="bg-muted dark:bg-muted/30 text-muted-foreground flex w-full items-center justify-center gap-1.5 rounded-lg py-4 text-sm">
            <CircleAlertIcon className="size-4" />
            <p>You have no installed plugins</p>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={closePlugins}>
            Cancel
          </Button>
          <Button variant="default" onClick={closePlugins}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
