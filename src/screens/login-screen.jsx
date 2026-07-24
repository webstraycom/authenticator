import { useState } from 'react';
import { Button } from '@ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@ui/card';
import { ForgotMasterPasswordButton } from '@common/forgot-master-password-button';
import { PasswordInput } from '@common/password-input';
import { useAuthStore } from '@store/use-auth-store';

export const LoginScreen = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = useAuthStore((state) => state.login);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const setupMasterPassword = useAuthStore((state) => state.setupMasterPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (isInitialized) {
      const success = await login(password);
      if (!success) {
        setError('Invalid master password');
      }
    } else {
      await setupMasterPassword(password);
    }
  };

  const handleFormCleanup = () => {
    setPassword('');
    setError('');
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
        <CardContent>
          <form id="login-form" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <PasswordInput
                id="password"
                label="Master Password"
                placeholder="••••••••"
                value={password}
                onChange={(value) => {
                  setPassword(value);
                  setError('');
                }}
                required
                autoFocus
              />
              {error && <p className="text-destructive text-sm">{error}</p>}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button form="login-form" type="submit" className="w-full">
            {isInitialized ? 'Unlock' : 'Setup & Start'}
          </Button>
          {isInitialized && <ForgotMasterPasswordButton onSuccess={handleFormCleanup} />}
        </CardFooter>
      </Card>
    </div>
  );
};
