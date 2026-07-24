import { useState } from 'react';
import { useAuthStore, useUIStore } from '@store';
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

export const VerificationDialog = () => {
  const verificationConfig = useUIStore((state) => state.verificationConfig);
  const closeVerification = useUIStore((state) => state.closeVerification);
  const setVerified = useUIStore((state) => state.setVerified);
  const verifyMasterPassword = useAuthStore((state) => state.verifyMasterPassword);

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = async (e) => {
    if (e) e.preventDefault();
    setError('');

    const isValid = await verifyMasterPassword(password);

    if (isValid) {
      setVerified();
      verificationConfig.onVerify();
      closeVerification();
      setPassword('');
    } else {
      setError('Invalid Master Password');
    }
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    if (error) setError('');
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    closeVerification();
  };

  return (
    <Dialog open={verificationConfig.isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="mt-5 sm:max-w-[350px]">
        <DialogHeader>
          <DialogTitle>{verificationConfig.title}</DialogTitle>
          <DialogDescription>{verificationConfig.description}</DialogDescription>
        </DialogHeader>
        <form id="master-password-form" onSubmit={handleConfirm}>
          <div className="flex flex-col gap-2">
            <PasswordInput
              id="password"
              label="Master Password"
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button form="master-password-form" type="submit">
            {verificationConfig.buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationDialog;
