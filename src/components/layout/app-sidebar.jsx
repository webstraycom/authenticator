import { ArrowLeftIcon, ClockIcon, CogIcon, KeyRoundIcon, LockIcon } from 'lucide-react';
import { Separator } from '@ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@ui/sidebar';
import { useAuthStore, useUIStore } from '@store';
import { useShortcut } from '@hooks/use-shortcut';

export const AppSidebar = () => {
  const openConfirm = useUIStore((state) => state.openConfirm);
  const logout = useAuthStore((state) => state.logout);
  const setScreen = useUIStore((state) => state.setScreen);

  const currentScreen = useUIStore((state) => state.currentScreen);

  const runWithVerification = useUIStore((state) => state.runWithVerification);

  const documentHasOpenDialog = () => !!document.querySelector('[role="dialog"]');

  const openPasswords = () => currentScreen !== 'passwords' && setScreen('passwords');
  const openTotp = () => currentScreen !== 'totp' && setScreen('totp');
  const openTokens = () => currentScreen !== 'tokens' && setScreen('tokens');
  const openSettings = () => {
    if (currentScreen === 'settings') return;
    runWithVerification(() => setScreen('settings'));
  };

  const openLogoutConfirm = () => {
    openConfirm({
      title: 'Sign Out?',
      description: 'Are you sure you want to sign out?',
      buttonText: 'Sign Out',
      onConfirm: () => {
        logout();
        setScreen('passwords');
      },
    });
  };

  const menuGroups = [
    {
      label: 'Dashboard',
      items: [
        {
          id: 'passwords',
          label: 'Passwords',
          icon: LockIcon,
          shortcut: 'control+1',
          action: openPasswords,
        },
        { id: 'totp', label: 'TOTP', icon: ClockIcon, shortcut: 'control+2', action: openTotp },
        {
          id: 'tokens',
          label: 'Tokens',
          icon: KeyRoundIcon,
          shortcut: 'control+3',
          action: openTokens,
        },
      ],
    },
    {
      label: 'System',
      items: [
        {
          id: 'settings',
          label: 'Settings',
          icon: CogIcon,
          shortcut: 'control+,',
          action: openSettings,
        },
        {
          id: 'signout',
          label: 'Sign Out',
          icon: ArrowLeftIcon,
          shortcut: 'control+l',
          action: openLogoutConfirm,
        },
      ],
    },
  ];

  useShortcut('ctrl+1', openPasswords, { disabled: documentHasOpenDialog });
  useShortcut('ctrl+2', openTotp, { disabled: documentHasOpenDialog });
  useShortcut('ctrl+3', openTokens, { disabled: documentHasOpenDialog });
  useShortcut('ctrl+comma', openSettings, { disabled: documentHasOpenDialog });
  useShortcut('ctrl+l', openLogoutConfirm, { disabled: documentHasOpenDialog });

  return (
    <Sidebar side="left">
      <SidebarContent className="pt-10">
        {menuGroups.map(({ label: groupLabel, items }) => (
          <SidebarGroup key={groupLabel} className="pt-2 pb-0">
            <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map(({ id, label, icon: Icon, shortcut, action }) => (
                  <SidebarMenuItem key={id}>
                    <SidebarMenuButton asChild>
                      <button
                        onClick={action}
                        className="text-[0.8rem] font-medium"
                        aria-current={currentScreen === id ? 'page' : null}
                        aria-keyshortcuts={shortcut}
                      >
                        <Icon />
                        {label}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <Separator
          orientation="vertical"
          className="via-border dark:via-border/50 modern:block absolute top-0 right-0 bottom-0 hidden bg-gradient-to-b from-transparent to-transparent"
        />
      </SidebarContent>
    </Sidebar>
  );
};
