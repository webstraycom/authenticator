import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTokensStore, useUIStore } from '@store';
import { Button } from '@ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ui/dialog';
import { Label } from '@ui/label';
import { ExpirationMessage } from '@common/expiration-message';
import { FormInput } from '@common/form-input';
import { NaturalDatePicker } from '@common/natural-date-picker';
import { PasswordInput } from '@common/password-input';

const getExpirationString = (date) => {
  return date
    ? new Date(date).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : ''
}

export const AddTokenDialog = () => {
  const addToken = useTokensStore((state) => state.addToken);
  const updateToken = useTokensStore((state) => state.updateToken);

  const isAddTokenOpen = useUIStore((state) => state.isAddTokenOpen);
  const closeAddToken = useUIStore((state) => state.closeAddToken);
  const editingToken = useUIStore((state) => state.editingToken);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { service: '', endpoint: '', token: '', expiration: '', expires: null },
    shouldFocusError: true,
  });

  useEffect(() => {
    if (isAddTokenOpen) {
      reset (
        editingToken
          ? {
            service: editingToken.service,
            endpoint: editingToken.endpoint,
            token: editingToken.value,
            expiration: getExpirationString(editingToken.expires),
            expires: editingToken.expires ? new Date(editingToken.expires) : null
          }
          : {
            service: '', endpoint: '', token: '', expiration: '', expires: null
          }
      )
    }
  }, [editingToken, isAddTokenOpen, reset]);

  const handleDateChange = (text, date) => {
    setValue('expiration', text);
    setValue('expires', date);
  };

  const onSubmit = (data) => {
    const { service, endpoint, token, expires } = data;

    if (editingToken) {
      updateToken(editingToken._id, service, endpoint, token, expires);
    } else {
      addToken(service, endpoint, token, expires);
    }

    closeAddToken();
  };

  const currentExpiration = watch('expiration');
  const currentExpires = watch('expires');

  return (
    <Dialog open={isAddTokenOpen} onOpenChange={(open) => !open && closeAddToken()}>
      <DialogContent className="mt-5 sm:max-w-[350px]">
        <form onSubmit={handleSubmit(onSubmit)} className="contents" noValidate>
          <DialogHeader>
            <DialogTitle>{editingToken ? 'Edit Token' : 'Add New Token'}</DialogTitle>
            <DialogDescription>
              {editingToken
                ? 'Update the details for this token.'
                : 'Enter the details of the token you want to save in the vault.'}
            </DialogDescription>
          </DialogHeader>
          <section className='flex flex-col gap-4'>
            <div className='grid grid-cols-2 gap-4'>
              <FormInput
                label="Service"
                id="add-service"
                placeholder="Google, GitHub, etc."
                error={errors.service}
                {...register('service', {required: 'Service is required'})}
              />

              <FormInput
                label="Endpoint"
                id="add-endpoint"
                placeholder="api.example.com"
                error={errors.endpoint}
                {...register('endpoint', {required: 'Endpoint is required'})}
              />
            </div>

            <PasswordInput
              label="Token"
              id="add-token"
              error={errors.token}
              {...register('token', {required: 'Token is required'})}
            />

            <div className="flex flex-col gap-2">
              <Label htmlFor="add-expiration" className="leading-snug">
                Expiration Date
              </Label>
              <NaturalDatePicker
                id="add-expiration"
                value={currentExpiration}
                onChange={handleDateChange}
              />
              <ExpirationMessage expiration={currentExpiration} expires={currentExpires} />
            </div>
          </section>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeAddToken}>
              Cancel
            </Button>
            <Button type="submit">
              {editingToken ? 'Save Changes' : 'Save Token'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
