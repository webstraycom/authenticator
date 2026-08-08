import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
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

const isValidBase32 = (secret) => {
  try {
    OTPAuth.Secret.fromBase32(secret);
    return true;
  } catch (error) {
    return false;
  }
};

export const AddCodeDialog = () => {
  const addCode = useCodesStore((state) => state.addCode);
  const updateCode = useCodesStore((state) => state.updateCode);

  const isAddCodeOpen = useUIStore((state) => state.isAddCodeOpen);
  const closeAddCode = useUIStore((state) => state.closeAddCode);
  const editingCode = useUIStore((state) => state.editingCode);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { service: '', account: '', secret: '' },
    shouldFocusError: true,
  });

  useEffect(() => {
    if (isAddCodeOpen) {
      reset(
        editingCode
          ? {
            service: editingCode.service,
            account: editingCode.account,
            secret: editingCode.value,
          }
          : { service: '', account: '', secret: '' },
      );
    }
  }, [editingCode, isAddCodeOpen, reset]);

  const onSubmit = (data) => {
    const { service, account, secret } = data;
    const secretValue = secret.trim();

    if (editingCode) {
      updateCode(editingCode._id, service, account, secretValue);
    } else {
      addCode(service, account, secretValue);
    }

    closeAddCode();
  };

  return (
    <Dialog open={isAddCodeOpen} onOpenChange={(open) => !open && closeAddCode()}>
      <DialogContent className="mt-5 sm:max-w-[350px]">
        <form onSubmit={handleSubmit(onSubmit)} className="contents" noValidate>
          <DialogHeader>
            <DialogTitle>{editingCode ? 'Edit Code' : 'Add New Code'}</DialogTitle>
            <DialogDescription>
              {editingCode
                ? 'Update the details for this code.'
                : 'Enter the details of the code you want to save in the vault.'}
            </DialogDescription>
          </DialogHeader>
          <section className='flex flex-col gap-4'>
            <FormInput
              label="Service"
              id="add-service"
              placeholder="Google, GitHub, etc."
              error={errors.service}
              {...register('service', {required: 'Service is required'})}
            />

            <FormInput
              label="Account"
              id="add-account"
              placeholder="user@example.com"
              error={errors.account}
              {...register('account', {required: 'Account is required'})}
            />

            <PasswordInput
              label="Secret"
              id="add-secret"
              error={errors.secret}
              {...register('secret', { 
                required: 'Secret is required',
                validate: (value) => isValidBase32(value) || 'Invalid secret'
              })}
            />
          </section>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeAddCode}>
              Cancel
            </Button>
            <Button type="submit">
              {editingCode ? 'Save Changes' : 'Save Code'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
