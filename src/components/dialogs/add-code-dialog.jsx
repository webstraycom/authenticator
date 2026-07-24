import { useEffect, useState } from 'react';
import { useCodesStore, useUIStore } from '@store';
import * as OTPAuth from 'otpauth';
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

const INITIAL_FORM = { service: '', account: '', secret: '' };

const isValidBase32 = (secret) => {
  try {
    OTPAuth.Secret.fromBase32(secret);
    return true;
  } catch (error) {
    return false;
  }
};

export const AddCodeDialog = () => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [error, setError] = useState('');

  const addCode = useCodesStore((state) => state.addCode);
  const updateCode = useCodesStore((state) => state.updateCode);

  const isAddCodeOpen = useUIStore((state) => state.isAddCodeOpen);
  const closeAddCode = useUIStore((state) => state.closeAddCode);
  const editingCode = useUIStore((state) => state.editingCode);

  useEffect(() => {
    setError('');
    if (isAddCodeOpen) {
      setFormData(
        editingCode
          ? {
              service: editingCode.service,
              account: editingCode.account,
              secret: editingCode.value,
            }
          : INITIAL_FORM,
      );
    } else {
      setFormData(INITIAL_FORM);
    }
  }, [editingCode, isAddCodeOpen]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const field = id.replace('add-', '');
    setError('');
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCodeChange = (value) => {
    setError('');
    setFormData((prev) => ({ ...prev, secret: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { service, account, secret } = formData;
    const secretValue = formData.secret.trim();

    if (!service || !account || !secret) return;

    if (!isValidBase32(secretValue)) {
      setError('Invalid Secret!');
      return;
    }

    if (editingCode) {
      updateCode(editingCode._id, service, account, secretValue);
    } else {
      addCode(service, account, secretValue);
    }

    setError('');
    closeAddCode();
  };

  return (
    <Dialog open={isAddCodeOpen} onOpenChange={(open) => !open && closeAddCode()}>
      <DialogContent className="mt-5 sm:max-w-[350px]">
        <DialogHeader>
          <DialogTitle>{editingCode ? 'Edit Code' : 'Add New Code'}</DialogTitle>
          <DialogDescription>
            {editingCode
              ? 'Update the details for this account.'
              : 'Enter the details of the account you want to save in the vault.'}
          </DialogDescription>
        </DialogHeader>

        <section>
          <form id="add-code-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormInput
              label="Service"
              id="add-service"
              type="text"
              placeholder="Google, GitHub, etc."
              value={formData.service}
              onChange={handleChange}
              required
            />

            <FormInput
              label="Account"
              id="add-account"
              type="text"
              placeholder="user@example.com"
              value={formData.account}
              onChange={handleChange}
              required
            />

            <div className="flex flex-col gap-2">
              <PasswordInput
                id="add-secret"
                label="Secret"
                placeholder="••••••••"
                value={formData.secret}
                onChange={handleCodeChange}
                required
              />
              {error && <p className="text-destructive text-sm">{error}</p>}
            </div>
          </form>
        </section>
        <DialogFooter>
          <Button variant="outline" onClick={closeAddCode}>
            Cancel
          </Button>
          <Button type="submit" form="add-code-form">
            {editingCode ? 'Save Changes' : 'Save Code'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
