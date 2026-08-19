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

export const AppSidebar = () => {
  const openConfirm = useUIStore((state) => state.openConfirm);
  const logout = useAuthStore((state) => state.logout);
  const setScreen = useUIStore((state) => state.setScreen);

  const runWithVerification = useUIStore((state) => state.runWithVerification);

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
          action: () => setScreen('passwords'),
        },
        { id: 'totp', label: 'TOTP', icon: ClockIcon, action: () => setScreen('totp') },
        { id: 'tokens', label: 'Tokens', icon: KeyRoundIcon, action: () => setScreen('tokens') },
      ],
    },
    {
      label: 'System',
      items: [
        {
          id: 'settings',
          label: 'Settings',
          icon: CogIcon,
          action: () =>
            runWithVerification(() => {
              setScreen('settings');
            }),
        },
        { id: 'signout', label: 'Sign Out', icon: ArrowLeftIcon, action: openLogoutConfirm },
      ],
    },
  ];

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
                {items.map(({ id, label, action, icon: Icon }) => (
                  <SidebarMenuItem key={id}>
                    <SidebarMenuButton asChild>
                      <button
                        onClick={action}
                        className="text-[0.8rem] font-medium"
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
      </SidebarContent>
    </Sidebar>
  );
};
