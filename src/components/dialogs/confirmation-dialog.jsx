import { useUIStore } from '@store';
import { Button } from '@ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ui/dialog';

export const ConfirmationDialog = () => {
  const confirmConfig = useUIStore((state) => state.confirmConfig);
  const closeConfirm = useUIStore((state) => state.closeConfirm);

  const handleConfirm = async () => {
    await confirmConfig.onConfirm();
    closeConfirm();
  };

  return (
    <Dialog open={confirmConfig.isOpen} onOpenChange={(open) => !open && closeConfirm()}>
      <DialogContent className="mt-5 sm:max-w-[350px]">
        <DialogHeader>
          <DialogTitle>{confirmConfig.title}</DialogTitle>

          <DialogDescription>{confirmConfig.description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={closeConfirm}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleConfirm}>
            {confirmConfig.buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
