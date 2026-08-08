import { useAuthStore, useUIStore } from '@store';
import { useForm } from 'react-hook-form';
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

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: { password: '' },
    shouldFocusError: true,
  });

  const onSubmit = async (data) => {
    const isValid = await verifyMasterPassword(data.password);

    if (isValid) {
      setVerified();
      verificationConfig.onVerify();
      handleClose();
    } else {
      setError('password', { type: 'manual', message: 'Invalid master password' });
    }
  };

  const handleClose = () => {
    reset();
    closeVerification();
  };

  return (
    <Dialog open={verificationConfig.isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="mt-5 sm:max-w-[350px]">
        <form onSubmit={handleSubmit(onSubmit)} className="contents" noValidate>
          <DialogHeader>
            <DialogTitle>{verificationConfig.title}</DialogTitle>
            <DialogDescription>{verificationConfig.description}</DialogDescription>
          </DialogHeader>
          <PasswordInput
            label="Master Password"
            id="password"
            error={errors.password}
            {...register('password', { required: 'Master password is required' })}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">{verificationConfig.buttonText}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
