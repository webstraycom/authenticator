import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@ui/dialog';
import { Button } from '@ui/button';
import { Label } from '@ui/label';
import { FormInput } from '@common/form-input';
import { PasswordInput } from '@common/password-input';
import { NaturalDatePicker } from '@common/natural-date-picker';
import { ExpirationMessage } from '@common/expiration-message';
import { useTokensStore, useUIStore } from '@store';

export const AddTokenDialog = () => {
  const initialForm = { service: '', endpoint: '', token: '', expiration: '', expires: null };
  const [formData, setFormData] = useState(initialForm);

  const addToken = useTokensStore((state) => state.addToken);
  const updateToken = useTokensStore((state) => state.updateToken);

  const isAddTokenOpen = useUIStore((state) => state.isAddTokenOpen);
  const closeAddToken = useUIStore((state) => state.closeAddToken);
  const editingToken = useUIStore((state) => state.editingToken);

  useEffect(() => {
    if (isAddTokenOpen) {
      if (editingToken) {
        const formattedDate = editingToken.expires
          ? new Date(editingToken.expires).toLocaleDateString('en-US', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })
          : '';
        setFormData({
          service: editingToken.service,
          endpoint: editingToken.endpoint,
          token: editingToken.value,
          expiration: formattedDate,
          expires: editingToken.expires ? new Date(editingToken.expires) : null,
        });
      } else {
        setFormData(initialForm);
      }
    } else {
      setFormData(initialForm);
    }
  }, [editingToken, isAddTokenOpen]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const field = id.replace('add-', '');
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTokenChange = (value) => {
    setFormData((prev) => ({ ...prev, token: value }));
  };

  const handleDateChange = (text, date) => {
    setFormData((prev) => ({
      ...prev,
      expiration: text,
      expires: date,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { service, endpoint, token, expires } = formData;

    if (!service || !endpoint || !token) return;

    if (editingToken) {
      updateToken(editingToken._id, service, endpoint, token, expires);
    } else {
      addToken(service, endpoint, token, expires);
    }

    closeAddToken();
  };

  return (
    <Dialog open={isAddTokenOpen} onOpenChange={(open) => !open && closeAddToken()}>
      <DialogContent className="mt-5 sm:max-w-[350px]">
        <DialogHeader>
          <DialogTitle>{editingToken ? 'Edit Token' : 'Add New Token'}</DialogTitle>
          <DialogDescription>
            {editingToken
              ? 'Update the details for this account.'
              : 'Enter the details of the account you want to save in the vault.'}
          </DialogDescription>
        </DialogHeader>
        <section>
          <form id="form-add-token" className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
              label="Endpoint"
              id="add-endpoint"
              type="text"
              placeholder="api.example.com"
              value={formData.endpoint}
              onChange={handleChange}
              required
            />

            <PasswordInput
              id="add-token"
              label="Token"
              placeholder="••••••••"
              value={formData.token}
              onChange={handleTokenChange}
              required
            />

            <div className="flex flex-col gap-2">
              <Label htmlFor="add-expiration" className="text-sm font-medium">
                Expiration Date
              </Label>
              <NaturalDatePicker
                id="add-expiration"
                value={formData.expiration}
                onChange={handleDateChange}
              />
              <ExpirationMessage expiration={formData.expiration} expires={formData.expires} />
            </div>
          </form>
        </section>
        <DialogFooter>
          <Button variant="outline" onClick={closeAddToken}>
            Cancel
          </Button>
          <Button type="submit" form="form-add-token">
            {editingToken ? 'Save Changes' : 'Save Token'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
