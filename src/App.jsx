import { useEffect } from 'react';
import { AppSidebar, TitleBar, Header } from '@/components/layout';
import { PasswordsScreen, TOTPScreen, SettingsScreen, LoginScreen, TokensScreen } from './screens';
import {
  AddPasswordDialog,
  AddCodeDialog,
  AddTokenDialog,
  ConfirmationDialog,
  VerificationDialog,
  DataManagementDialog,
  ChangeMasterPasswordDialog,
  PluginsDialog,
  CommandPaletteDialog,
} from '@/components/dialogs';
import { AppLoadingPlaceholder } from '@common/AppLoadingPlaceholder';
import { Toaster } from '@ui/Sonner';
import { SidebarProvider } from '@ui/Sidebar';
import { useAppLoaded } from '@hooks/useAppLoaded';
import { useSettingsStore, useAuthStore, useUIStore } from '@store';
import { PluginProvider } from '@sdk/PluginSystem';

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
              <main className="bg-background flex h-full flex-1 flex-col overflow-hidden">
                <Header />
                <div className="flex-1 overflow-hidden overflow-x-hidden">
                  {screen === 'passwords' && <PasswordsScreen />}
                  {screen === 'totp' && <TOTPScreen />}
                  {screen === 'tokens' && <TokensScreen />}
                  {screen === 'settings' && <SettingsScreen />}
                </div>
              </main>
            </SidebarProvider>
            <AddPasswordDialog />
            <AddCodeDialog />
            <AddTokenDialog />
            <VerificationDialog />
            <DataManagementDialog />
            <ChangeMasterPasswordDialog />
            <PluginsDialog />
            <CommandPaletteDialog />
          </div>
        )}
        <ConfirmationDialog />
        <Toaster
          className="z-150"
          toastOptions={{ style: { right: '7px', bottom: '7px', fontFamily: 'Geist, sans-serif' },
          classNames: {
            toast: "[&_[data-icon]]:!self-start [&_[data-icon]]:!mt-0.25",
            description: "!text-muted-foreground",
            actionButton: "!font-medium !rounded-md",
          },}}
        />
        <PluginProvider />
      </div>
    </div>
  );
}

export default App;
