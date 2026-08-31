import { create } from 'zustand';
import { useSettingsStore } from '@store/use-settings-store';

const CONFIRM_DEFAULTS = {
  isOpen: false,
  title: 'Are you sure?',
  description: 'This action cannot be undone.',
  buttonText: 'Confirm',
  onConfirm: () => {},
};

const VERIFICATION_DEFAULTS = {
  isOpen: false,
  title: 'Verification Required',
  description: 'Please enter your master password to continue.',
  buttonText: 'Verify',
  onVerify: () => {},
};

export const useUIStore = create((set, get) => ({
  currentScreen: 'passwords',

  lastVerified: null,
  editingPassword: null,
  editingCode: null,
  editingToken: null,
  itemToDelete: null,

  isAddPasswordOpen: false,
  isAddCodeOpen: false,
  isAddTokenOpen: false,
  isChangeMasterPasswordOpen: false,
  isPluginsOpen: false,
  isCommandPaletteOpen: false,
  isShortcutsOpen: false,

  confirmConfig: CONFIRM_DEFAULTS,

  verificationConfig: VERIFICATION_DEFAULTS,

  dataManagementConfig: {
    isOpen: false,
    mode: 'import',
    type: null,
    importedItems: '',
    onSuccess: () => {},
  },

  isSessionValid: () => {
    const last = get().lastVerified;
    if (!last) return false;

    const timeoutMinutes = useSettingsStore.getState().settings.verificationTimeout;
    const timeoutMS = timeoutMinutes * 60 * 1000;

    return Date.now() - last < timeoutMS;
  },

  setScreen: (screen) => set({ currentScreen: screen }),

  setVerified: () => set({ lastVerified: Date.now() }),

  openAddPassword: () =>
    set({
      editingPassword: null,
      isAddPasswordOpen: true,
    }),

  openEditPassword: (item) =>
    set({
      editingPassword: { ...item },
      isAddPasswordOpen: true,
    }),

  closeAddPassword: () =>
    set({
      editingPassword: null,
      isAddPasswordOpen: false,
    }),

  openAddCode: () =>
    set({
      editingCode: null,
      isAddCodeOpen: true,
    }),

  openEditCode: (item) =>
    set({
      editingCode: { ...item },
      isAddCodeOpen: true,
    }),

  closeAddCode: () =>
    set({
      isAddCodeOpen: false,
      editingCode: null,
    }),

  openAddToken: () =>
    set({
      editingToken: null,
      isAddTokenOpen: true,
    }),

  openEditToken: (item) =>
    set({
      editingToken: { ...item },
      isAddTokenOpen: true,
    }),

  closeAddToken: () =>
    set({
      isAddTokenOpen: false,
      editingToken: null,
    }),

  openChangeMasterPassword: () =>
    set({
      isChangeMasterPasswordOpen: true,
    }),

  closeChangeMasterPassword: () =>
    set({
      isChangeMasterPasswordOpen: false,
    }),

  openPlugins: () =>
    set({
      isPluginsOpen: true,
    }),

  closePlugins: () =>
    set({
      isPluginsOpen: false,
    }),

  openCommandPalette: () =>
    set({
      isCommandPaletteOpen: true,
    }),

  closeCommandPalette: () =>
    set({
      isCommandPaletteOpen: false,
    }),

  openShortcuts: () =>
    set({
      isShortcutsOpen: true,
    }),

  closeShortcuts: () =>
    set({
      isShortcutsOpen: false,
    }),

  openConfirm: (config) =>
    set({
      confirmConfig: { ...CONFIRM_DEFAULTS, ...config, isOpen: true },
    }),

  closeConfirm: () =>
    set((state) => ({
      confirmConfig: { ...state.confirmConfig, isOpen: false },
    })),

  openVerification: (config) =>
    set({
      verificationConfig: { ...VERIFICATION_DEFAULTS, ...config, isOpen: true },
    }),

  closeVerification: () =>
    set((state) => ({
      verificationConfig: { ...state.verificationConfig, isOpen: false },
    })),

  runWithVerification: (action, config = {}) => {
    const { force = false, ...dialogConfig } = config;
    const { isSessionValid, openVerification } = get();
    const requireVerification = useSettingsStore.getState().settings.requireVerification;

    if (!force && (!requireVerification || isSessionValid())) {
      action();
    } else {
      openVerification({
        onVerify: action,
        ...dialogConfig,
      });
    }
  },

  setDataManagementMode: (mode) =>
    set((state) => ({
      dataManagementConfig: { ...state.dataManagementConfig, mode },
    })),

  openDataManagement: (config) =>
    set({
      dataManagementConfig: { ...config, isOpen: true },
    }),

  closeDataManagement: () =>
    set((state) => ({
      dataManagementConfig: { ...state.dataManagementConfig, isOpen: false },
    })),
}));
