import { useAuthStore, useUIStore } from '@store';
import { ArrowLeftIcon, ClockIcon, CogIcon, KeyRoundIcon, LockIcon } from 'lucide-react';
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
import { useShortcut } from '@hooks/use-shortcut';
import { Separator } from '@ui/separator';

export const AppSidebar = () => {
  const openConfirm = useUIStore((state) => state.openConfirm);
  const logout = useAuthStore((state) => state.logout);
  const setScreen = useUIStore((state) => state.setScreen);

  const currentScreen = useUIStore((state) => state.currentScreen);

  const runWithVerification = useUIStore((state) => state.runWithVerification);

  const openPasswords = () => setScreen('passwords');
  const openTotp = () => setScreen('totp');
  const openTokens = () => setScreen('tokens');
  const openSettings = () => runWithVerification(() => setScreen('settings'));

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
        { id: 'tokens', label: 'Tokens', icon: KeyRoundIcon, shortcut: 'control+3', action: openTokens },
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
        { id: 'signout', label: 'Sign Out', icon: ArrowLeftIcon, shortcut: 'control+l', action: openLogoutConfirm },
      ],
    },
  ];

  useShortcut('ctrl+1', openPasswords);
  useShortcut('ctrl+2', openTotp);
  useShortcut('ctrl+3', openTokens);
  useShortcut('ctrl+comma', openSettings);
  useShortcut('ctrl+l', openLogoutConfirm);

  return (
    <Sidebar side="left">
      <SidebarContent className="pt-10">
        {menuGroups.map(({ label: groupLabel, items }) => (
          <SidebarGroup key={groupLabel} className="pt-2 pb-0">
            <SidebarGroupLabel>
              {groupLabel}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map(({ id, label, icon: Icon, shortcut, action, }) => (
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
        <Separator orientation='vertical' className="absolute right-0 top-0 bottom-0 bg-gradient-to-b from-transparent via-border dark:via-border/50 to-transparent hidden modern:block" />
      </SidebarContent>
    </Sidebar>
  );
};
