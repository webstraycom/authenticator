import React from 'react';
import { CircleAlertIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@ui/Dialog';
import { Button } from '@ui/Button';
import { Switch } from '@ui/Switch';
import { Badge } from '@ui/Badge';
import { useUIStore } from '@store';
import { usePluginsLogic } from '@hooks/usePluginsLogic';
import { pluginManager } from '@sdk/PluginManager';
import { cn } from '@lib/utils';

export const PluginsDialog = () => {
  const isPluginsOpen = useUIStore((state) => state.isPluginsOpen);
  const closePlugins = useUIStore((state) => state.closePlugins);

  const { installedPlugins, enabledPlugins, handleTogglePlugin } = usePluginsLogic();

  const sortedPlugins = [...installedPlugins].sort((a, b) =>
    (a.title || '').localeCompare(b.title || ''),
  );

  const handleOpenPluginsFolder = () => {
    pluginManager.openPluginsFolder();
  };

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
        <div
          className={cn(
            'max-h-47 w-full overflow-y-auto',
            installedPlugins.length > 0
              ? 'scroll-fade scroll-fade-24 pb-px'
              : '',
          )}
        >
          <div className="flex flex-col gap-2">
            {sortedPlugins.length > 0 ? (
              sortedPlugins.map((plugin) => (
                <div
                  key={plugin.id}
                  className="dark:bg-muted/30 flex items-start justify-between gap-4 rounded-lg border p-3 shadow-xs dark:shadow-none"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold">{plugin.title}</span>
                      <Badge variant="secondary" className="h-4 px-1.5 py-2 text-xs">
                        {plugin.version}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs">{plugin.description}</p>
                  </div>

                  <Switch
                    checked={enabledPlugins.includes(plugin.id)}
                    onCheckedChange={() => handleTogglePlugin(plugin.id)}
                  />
                </div>
              ))
            ) : (
              <div className="bg-muted dark:bg-muted/30 text-muted-foreground flex w-full items-center justify-center gap-1.5 rounded-lg py-4 text-sm">
                <CircleAlertIcon className="size-4" />
                <p>You have no installed plugins</p>
              </div>
            )}
          </div>
        </div>
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
