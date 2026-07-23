import React from 'react';
import { toast } from 'sonner';
import * as Icons from 'lucide-react';
import * as components from '@sdk/components';
import { create } from 'zustand';
import { encrypt, decrypt } from '@utils/crypto';
import { sorter } from '@utils/sorter';
import { getTOTP } from '@utils/totp';
import { cn } from '@lib/utils';

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
  Icons,
  components,
  pkg,
  db,
  crypto: {
    encrypt: (text) => {
      const result = encrypt(text);
      if (!result) throw new Error('Encryption failed. The vault may be locked.');
      return result;
    },
    decrypt: (text) => {
      const result = decrypt(text);
      if (result == null) throw new Error('Decryption failed. The vault may be locked or the password may be corrupted.');
      return result;
    },
  },
  ui: {
    openSheet: (Content) => usePluginStore.getState().openSheet(pkg, Content),
    closeSheet: () => usePluginStore.getState().closeSheet(),
    notify: (messageOrPromise, type = 'default', options = {}) => {
      if (messageOrPromise instanceof Promise) return toast.promise(messageOrPromise, options);
      return (toast[type] || toast)(messageOrPromise, options);
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
