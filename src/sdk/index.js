import React from 'react';
import { toast } from 'sonner';
import * as LucideIcons from 'lucide-react';
import { create } from 'zustand';
import { decrypt } from '@utils/crypto';
import { sorter } from '@utils/sorter';
import { getTOTP } from '@utils/totp';
import { cn } from '@lib/utils';

import { Button } from '@ui/Button';
import { Badge } from '@ui/Badge';
import { Checkbox } from '@ui/Checkbox';
import { Input } from '@ui/Input';
import { Label } from '@ui/Label';
import { Progress } from '@ui/Progress';
import { Switch } from '@ui/Switch';
import { Slider } from '@ui/Slider';
import { Separator } from '@ui/Separator';
import { ScrollArea } from '@ui/ScrollArea';
import { Skeleton } from '@ui/Skeleton';
import { Spinner } from '@ui/Spinner';
import { Toggle } from '@ui/Toggle';
import { ToggleGroup } from '@ui/ToggleGroup';

import * as Combobox from '@ui/Combobox';
import * as Command from '@ui/Command';
import * as Empty from '@ui/Empty';
import * as Field from '@ui/Field';
import * as Kbd from '@ui/Kbd';
import * as Item from '@ui/Item';
import * as InputGroup from '@ui/InputGroup';
import * as ButtonGroup from '@ui/ButtonGroup';
import * as Card from '@ui/Card';
import * as Select from '@ui/Select';
import * as Tabs from '@ui/Tabs';
import * as Popover from '@ui/Popover';
import * as RadioGroup from '@ui/RadioGroup';
import * as Tooltip from '@ui/Tooltip';
import * as HoverCard from '@ui/HoverCard';
import * as DropdownMenu from '@ui/DropdownMenu';

export const usePluginStore = create((set, get) => ({
  slots: {},
  activeSheet: null,
  installedPlugins: [],
  enabledPlugins: [],
  destructors: {},

  setEnabledPlugins: (list) => set({ enabledPlugins: list }),
  setInstalledPlugins: (list) => set({ installedPlugins: list }),

  registerAction: (slotName, pluginId, action) =>
    set((state) => {
      if (!state.enabledPlugins.includes(pluginId)) return state;
      return {
        slots: {
          ...state.slots,
          [slotName]: { ...(state.slots[slotName] || {}), [pluginId]: action },
        },
      };
    }),

  registerDestructor: (pluginId, cleanupFn) =>
    set((state) => ({
      destructors: { ...state.destructors, [pluginId]: cleanupFn },
    })),

  runDestructor: (pluginId) => {
    const cleanupFn = get().destructors[pluginId];
    if (typeof cleanupFn === 'function') {
      try {
        cleanupFn();
      } catch (e) {
        console.error(`[SDK] Cleanup failed: ${pluginId}`, e);
      }
    }
    set((state) => {
      const { [pluginId]: _, ...rest } = state.destructors;
      return { destructors: rest };
    });
  },

  openSheet: (pkg, Content) =>
    set({
      activeSheet: { ...pkg, Content },
    }),

  closeSheet: () => set({ activeSheet: null }),

  clearAllSlots: () => set({ slots: {} }),

  disableAllPlugins: () => {
    const { destructors, runDestructor, clearAllSlots } = get();
    Object.keys(destructors).forEach((id) => runDestructor(id));
    clearAllSlots();
  },
}));

export const createSDK = (pkg, db) => ({
  React,
  Icons: LucideIcons,
  components: {
    Badge,
    Button,
    ButtonGroup,
    Card,
    Checkbox,
    Combobox,
    Command,
    DropdownMenu,
    Empty,
    Field,
    Input,
    Item,
    Kbd,
    InputGroup,
    Separator,
    Label,
    Progress,
    RadioGroup,
    Popover,
    ScrollArea,
    Select,
    Skeleton,
    Slider,
    Spinner,
    HoverCard,
    Switch,
    Tabs,
    Tooltip,
    Toggle,
    ToggleGroup,
  },
  pkg,
  db,
  crypto: {
    decrypt: (text) => {
      const result = decrypt(text);
      if (result === null || result === undefined) {
        console.error(
          `[SDK] ${pkg.id}: Decryption failed. The vault may be locked or the password may be corrupted.`,
        );
        throw new Error(
          'Decryption failed. The vault may be locked or the password may be corrupted.',
        );
      }
      return result;
    },
  },
  ui: {
    openSheet: (Content) => usePluginStore.getState().openSheet(pkg, Content),
    closeSheet: () => usePluginStore.getState().closeSheet(),
    notify: (message, type = 'success') => {
      if (type === 'error') toast.error(message);
      else toast.success(message);
    },
  },
  utils: {
    cn,
    sorter,
    getTOTP,
  },
  plugin: {
    registerMenuAction: (slotName, config) =>
      usePluginStore.getState().registerAction(slotName, pkg.id, config),
  },
});
