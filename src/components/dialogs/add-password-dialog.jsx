import { useEffect } from 'react';
import { usePasswordsStore, useUIStore } from '@store';
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
import { FormInput } from '@common/form-input';
import { PasswordInput } from '@common/password-input';

export const AddPasswordDialog = () => {
  const addPassword = usePasswordsStore((state) => state.addPassword);
  const updatePassword = usePasswordsStore((state) => state.updatePassword);

  const isAddPasswordOpen = useUIStore((state) => state.isAddPasswordOpen);
  const closeAddPassword = useUIStore((state) => state.closeAddPassword);
  const editingPassword = useUIStore((state) => state.editingPassword);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { site: '', login: '', password: '' },
    shouldFocusError: true,
  });

  useEffect(() => {
    if (isAddPasswordOpen) {
      reset(
        editingPassword
          ? {
              site: editingPassword.site,
              login: editingPassword.login,
              password: editingPassword.value,
            }
          : { site: '', login: '', password: '' },
      );
    }
  }, [isAddPasswordOpen, editingPassword, reset]);

  const onSubmit = (data) => {
    const { site, login, password } = data;

    if (editingPassword) {
      updatePassword(editingPassword._id, site, login, password);
    } else {
      addPassword(site, login, password);
    }
    closeAddPassword();
  };

  return (
    <Dialog open={isAddPasswordOpen} onOpenChange={(open) => !open && closeAddPassword()}>
      <DialogContent className="mt-5 sm:max-w-[350px]">
        <form onSubmit={handleSubmit(onSubmit)} className="contents" noValidate>
          <DialogHeader>
            <DialogTitle>{editingPassword ? 'Edit Password' : 'Add New Password'}</DialogTitle>
            <DialogDescription>
              {editingPassword
                ? 'Update the details for this password.'
                : 'Enter the details of the password you want to save in the vault.'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <FormInput
              label="Site"
              id="add-password-site"
              placeholder="Google, GitHub, etc."
              error={errors.site}
              {...register('site', { required: 'Site is required' })}
            />

            <FormInput
              label="Login"
              id="add-password-login"
              placeholder="user@example.com"
              error={errors.login}
              {...register('login', { required: 'Login is required' })}
            />

            <PasswordInput
              label="Password"
              id="add-password-password"
              error={errors.password}
              {...register('password', { required: 'Password is required' })}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeAddPassword}>
              Cancel
            </Button>
            <Button type="submit">{editingPassword ? 'Save Changes' : 'Save Password'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
