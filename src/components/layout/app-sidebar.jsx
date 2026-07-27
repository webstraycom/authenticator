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

  const handleLogoutClick = () => {
    openConfirm({
      title: 'Sign Out?',
      description: 'Are you sure you want to log out?',
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
        { id: 'signout', label: 'Sign Out', icon: ArrowLeftIcon, action: handleLogoutClick },
      ],
    },
  ];

  return (
    <Sidebar side="left" className="border-r border-neutral-200 dark:border-neutral-800">
      <SidebarContent className="pt-10">
        {menuGroups.map(({ label: groupLabel, items }) => (
          <SidebarGroup key={groupLabel} className="pt-2 pb-0">
            <SidebarGroupLabel asChild>
              <h3 className="text-sidebar-foreground/70">{groupLabel}</h3>
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {items.map(({ id, label, action, icon: Icon }) => (
                  <SidebarMenuItem key={id}>
                    <SidebarMenuButton
                      asChild
                      className="hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                    >
                      <a
                        href="#"
                        draggable="false"
                        onClick={(e) => {
                          e.preventDefault();
                          action();
                        }}
                      >
                        <Icon />
                        <span className="text-[0.8rem] font-medium">{label}</span>
                      </a>
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
