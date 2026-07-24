import { useEffect, useState } from 'react';
import { usePasswordsStore, useUIStore } from '@store';
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
  const initialForm = { site: '', login: '', password: '' };
  const [formData, setFormData] = useState(initialForm);

  const addPassword = usePasswordsStore((state) => state.addPassword);
  const updatePassword = usePasswordsStore((state) => state.updatePassword);

  const isAddPasswordOpen = useUIStore((state) => state.isAddPasswordOpen);
  const closeAddPassword = useUIStore((state) => state.closeAddPassword);
  const editingPassword = useUIStore((state) => state.editingPassword);

  useEffect(() => {
    if (isAddPasswordOpen) {
      setFormData(
        editingPassword
          ? {
              site: editingPassword.site,
              login: editingPassword.login,
              password: editingPassword.value,
            }
          : initialForm,
      );
    } else {
      setFormData(initialForm);
    }
  }, [isAddPasswordOpen, editingPassword]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const field = id.replace('add-', '');
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (value) => {
    setFormData((prev) => ({ ...prev, password: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { site, login, password } = formData;

    if (!site || !login || !password) return;

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
        <DialogHeader>
          <DialogTitle>{editingPassword ? 'Edit Password' : 'Add New Password'}</DialogTitle>
          <DialogDescription>
            {editingPassword
              ? 'Update the details for this account.'
              : 'Enter the details of the account you want to save in the vault.'}
          </DialogDescription>
        </DialogHeader>

        <section>
          <form id="add-password-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormInput
              label="Service"
              id="add-site"
              type="text"
              placeholder="Google, GitHub, etc."
              value={formData.site}
              onChange={handleChange}
              required
            />

            <FormInput
              label="Login"
              id="add-login"
              type="text"
              placeholder="user@example.com"
              value={formData.login}
              onChange={handleChange}
              required
            />

            <PasswordInput
              id="add-password"
              label="Password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handlePasswordChange}
              required
            />
          </form>
        </section>
        <DialogFooter>
          <Button variant="outline" onClick={closeAddPassword}>
            Cancel
          </Button>
          <Button type="submit" form="add-password-form">
            {editingPassword ? 'Save Changes' : 'Save Password'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
