import { useMemo } from 'react';
import { usePluginStore } from '@sdk';
import { CircleAlertIcon } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';
import { Badge } from '@ui/badge';
import { DropdownMenuItem } from '@ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@ui/sheet';

export const Slot = ({ slotName }) => {
  const slotData = usePluginStore((state) => state.slots[slotName]);

  const renderedActions = useMemo(() => {
    if (!slotData) return null;

    return Object.entries(slotData)
      .sort(([, actionA], [, actionB]) => {
        const titleA = (actionA.title || '').toLowerCase();
        const titleB = (actionB.title || '').toLowerCase();
        return titleA.localeCompare(titleB);
      })
      .map(([pluginId, action]) => {
        return (
          <DropdownMenuItem
            key={pluginId}
            onSelect={() => {
              try {
                action.onClick();
              } catch (e) {
                console.error(`[Slot] Action error in ${pluginId}:`, e);
              }
            }}
          >
            <span>{action.title}</span>
          </DropdownMenuItem>
        );
      });
  }, [slotData]);

  return <>{renderedActions}</>;
};

export const PluginProvider = () => {
  const activeSheet = usePluginStore((state) => state.activeSheet);
  const closeSheet = usePluginStore((state) => state.closeSheet);

  return (
    <Sheet open={!!activeSheet} onOpenChange={closeSheet}>
      <SheetContent
        className="flex h-full flex-col gap-0 pt-10 outline-none sm:max-w-sm"
        showCloseButton={false}
      >
        {activeSheet && (
          <div className="flex h-full flex-col" key={activeSheet.title + activeSheet.version}>
            <SheetHeader className="shrink-0">
              <SheetTitle>
                <div className="flex gap-1.5">
                  <span>{activeSheet.title}</span>
                  <Badge variant="secondary">{activeSheet.version}</Badge>
                </div>
              </SheetTitle>
              <SheetDescription>{activeSheet.description}</SheetDescription>
            </SheetHeader>
            <div className="flex min-h-0 flex-1 flex-col px-4 pb-4">
              <ErrorBoundary
                fallbackRender={({ error }) => (
                  <div className="w-full overflow-hidden rounded-lg bg-red-400/10 p-4 text-sm text-red-400 dark:bg-red-400/5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <CircleAlertIcon className="size-4 shrink-0" />
                        <span>Plugin Error:</span>
                      </div>
                      <span className="pl-5.5">{error.message}</span>
                    </div>
                  </div>
                )}
              >
                <activeSheet.Content />
              </ErrorBoundary>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
