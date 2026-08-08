import { useForm } from 'react-hook-form';
import { useAuthStore, useUIStore } from '@store';
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
import { Spinner } from '@ui/spinner';

export const ChangeMasterPasswordDialog = () => {
  const isChangeMasterPasswordOpen = useUIStore((state) => state.isChangeMasterPasswordOpen);
  const closeChangeMasterPassword = useUIStore((state) => state.closeChangeMasterPassword);
  const changeMasterPassword = useAuthStore((state) => state.changeMasterPassword);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { oldPassword: '', newPassword: '', confirmPassword: '' },
    shouldFocusError: true,
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    try {
      const {oldPassword, newPassword} = data;
      const result = await changeMasterPassword(oldPassword, newPassword);

      if (result.success) {
        toast.success('The password has been changed.');
        handleClose();
      } else {
        setError('oldPassword', { type: 'manual', message: result.error || 'An error occurred' });
      }
    } catch (err) {
      setError('oldPassword', { type: 'manual', message: 'System error' });
    }
  };

  const handleClose = () => {
    reset();
    closeChangeMasterPassword();
  }

  return (
    <Dialog
      open={isChangeMasterPasswordOpen}
      onOpenChange={(open) => !open && !isSubmitting && handleClose()}
    >
      <DialogContent className="mt-5 sm:max-w-[350px]">
        <form onSubmit={handleSubmit(onSubmit)} className='contents' noValidate>
          <DialogHeader>
            <DialogTitle>Change Master Password</DialogTitle>
            <DialogDescription>Here you can change your master password.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <PasswordInput
              label="Current Password"
              id="oldPassword"
              disabled={isSubmitting}
              error={errors.oldPassword}
              {...register('oldPassword', {required: 'Current password is required'})}
            />
            <PasswordInput
              label="New Password"
              id="newPassword"
              disabled={isSubmitting}
              error={errors.newPassword}
              {...register('newPassword', { 
                required: 'New password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters long'
                },
                onChange: () => {
                  if (watch('confirmPassword')) {
                    trigger('confirmPassword');
                  }
                }
              })}
            />
            <PasswordInput
              label="Confirm New Password"
              id="confirmPassword"
              disabled={isSubmitting}
              error={errors.confirmPassword}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === watch('newPassword') || "Passwords don't match",
              })}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-1">
              {isSubmitting ? (
                <>
                  <Spinner />
                  Changing...
                </>
              ) : (
                <>Change</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
