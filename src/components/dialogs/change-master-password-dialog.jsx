import { useState } from 'react';
import { useAuthStore, useUIStore } from '@store';
import { LoaderIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ui/dialog';
import { PasswordInput } from '@common/password-input';

export const ChangeMasterPasswordDialog = () => {
  const isChangeMasterPasswordOpen = useUIStore((state) => state.isChangeMasterPasswordOpen);
  const closeChangeMasterPassword = useUIStore((state) => state.closeChangeMasterPassword);
  const changeMasterPassword = useAuthStore((state) => state.changeMasterPassword);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (setter) => (value) => {
    setter(value);
    if (error) setError('');
  };

  const handleConfirm = async (e) => {
    if (e) e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    setIsLoading(true);
    try {
      const result = await changeMasterPassword(oldPassword, newPassword);

      if (result.success) {
        toast.success('The password has been changed!');
        handleClose();
      } else {
        setError(result.error || 'An error occurred while changing your password');
      }
    } catch (err) {
      setError('System Error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    closeChangeMasterPassword();
  };

  return (
    <Dialog
      open={isChangeMasterPasswordOpen}
      onOpenChange={(open) => !open && !isLoading && handleClose()}
    >
      <DialogContent className="mt-5 sm:max-w-[350px]">
        <DialogHeader>
          <DialogTitle>Change Master Password</DialogTitle>
          <DialogDescription>Here you can change your master password.</DialogDescription>
        </DialogHeader>
        <form id="master-password-form" onSubmit={handleConfirm}>
          <div className="flex flex-col gap-4">
            <PasswordInput
              id="oldPassword"
              label="Current Password"
              value={oldPassword}
              onChange={handleInputChange(setOldPassword)}
              required
            />
            <PasswordInput
              id="newPassword"
              label="New Password"
              value={newPassword}
              onChange={handleInputChange(setNewPassword)}
              required
            />
            <PasswordInput
              id="confirmPassword"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={handleInputChange(setConfirmPassword)}
              required
            />

            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button form="master-password-form" type="submit" disabled={isLoading} className="gap-1">
            {isLoading ? (
              <>
                <LoaderIcon className="size-4 animate-spin" />
                Changing...
              </>
            ) : (
              <>Change</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
