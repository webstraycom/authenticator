import { useEffect } from 'react';
import {
  AddCodeDialog,
  AddPasswordDialog,
  AddTokenDialog,
  ChangeMasterPasswordDialog,
  CommandPaletteDialog,
  ConfirmationDialog,
  DataManagementDialog,
  PluginsDialog,
  VerificationDialog,
} from '@dialogs';
import { AppSidebar, Header, TitleBar } from '@layout';
import { LoginScreen, PasswordsScreen, SettingsScreen, TokensScreen, TOTPScreen } from '@screens';
import { useAuthStore, useSettingsStore, useUIStore } from '@store';
import { SidebarProvider } from '@ui/sidebar';
import { Toaster } from '@ui/sonner';
import { AppLoadingPlaceholder } from '@common/app-loading-placeholder';
import { useAppLoaded } from '@hooks/use-app-loaded';
import { PluginProvider } from '@sdk/plugin-system';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const screen = useUIStore((state) => state.currentScreen);

  const isAppLoaded = useAppLoaded();

  useEffect(() => {
    const initializeApp = async () => {
      await useSettingsStore.getState().loadSettings();
      await checkAuth();
    };
    initializeApp();
  }, [checkAuth]);

  if (isAuthenticated === null) return <div className="bg-background" />;

  return (
    <div className="bg-background flex h-screen w-full flex-col overflow-hidden">
      <TitleBar className={!isAppLoaded ? 'isolate-title-bar' : ''} />
      <div className="flex w-full flex-1 overflow-hidden">
        {!isAppLoaded ? (
          <AppLoadingPlaceholder />
        ) : !isAuthenticated ? (
          <LoginScreen />
        ) : (
          <div className="flex h-full w-full overflow-hidden">
            <SidebarProvider className="min-h-full">
              <AppSidebar />
              <div className="bg-background flex h-full flex-1 flex-col overflow-hidden">
                <Header />
                <main className="flex flex-1 overflow-hidden" aria-live='polite' aria-atomic="true">
                  {screen === 'passwords' && <PasswordsScreen />}
                  {screen === 'totp' && <TOTPScreen />}
                  {screen === 'tokens' && <TokensScreen />}
                  {screen === 'settings' && <SettingsScreen />}
                </main>
              </div>
            </SidebarProvider>
            <AddPasswordDialog />
            <AddCodeDialog />
            <AddTokenDialog />
            <VerificationDialog />
            <DataManagementDialog />
            <ChangeMasterPasswordDialog />
            <PluginsDialog />
            <CommandPaletteDialog />
            <PluginProvider />
          </div>
        )}
        <ConfirmationDialog />
        <Toaster
          className="z-150"
          toastOptions={{
            style: { right: '7px', bottom: '7px', fontFamily: 'Geist, sans-serif' },
            classNames: {
              toast: '[&_[data-icon]]:!self-start [&_[data-icon]]:!mt-0.25',
              description: '!text-muted-foreground',
              actionButton: '!font-medium !rounded-md',
            },
          }}
        />
      </div>
    </div>
  );
}

export default App;
