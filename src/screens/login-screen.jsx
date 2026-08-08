import { useForm } from 'react-hook-form';
import { Button } from '@ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@ui/card';
import { ForgotMasterPasswordButton } from '@common/forgot-master-password-button';
import { PasswordInput } from '@common/password-input';
import { useAuthStore } from '@store/use-auth-store';
import { Spinner } from '@ui/spinner';

export const LoginScreen = () => {
  const login = useAuthStore((state) => state.login);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const setupMasterPassword = useAuthStore((state) => state.setupMasterPassword);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { password: '' },
    shouldFocusError: true,
  });

  const onSubmit = async (data) => {
    const { password } = data;

    if (isInitialized) {
      const success = await login(password);
      if (!success) {
        setError('password', {
          type: 'manual',
          message: 'Invalid master password',
        });
      }
    } else {
      await setupMasterPassword(password);
    }
  };

  const handleFormCleanup = () => {
    reset();
  };

  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{isInitialized ? 'Unlock Vault' : 'Create Master Password'}</CardTitle>
          <CardDescription>
            {isInitialized
              ? 'Enter your master password to access your data.'
              : 'Set a strong password. If you lose it, data cannot be recovered.'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='contents' noValidate>
          <CardContent>
            <PasswordInput
              label="Master Password"
              id="password"
              description={!isInitialized && "Must be at least 8 characters long."}
              autoFocus
              disabled={isSubmitting}
              error={errors.password}
              {...register('password', {
                required: 'Master password is required',
                minLength: {
                  value: 8,
                  message: 'Master password must be at least 8 characters',
                },
              })}
            />
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting
                ? (
                  <>
                  <Spinner />
                  Loading...
                  </>
                )
                : (isInitialized ? 'Unlock' : 'Setup & Start')
              }
            </Button>
            {isInitialized && <ForgotMasterPasswordButton onSuccess={handleFormCleanup} />}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
