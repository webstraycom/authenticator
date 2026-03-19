import { create } from 'zustand';
import { db } from '@utils/db';
import { runViewTransition } from '@utils/viewTransition';

const DEFAULT_SETTINGS = {
  theme: 'dark',
  verificationTimeout: 5,
  requireVerification: true,
};

export const useSettingsStore = create((set, get) => ({
  settings: DEFAULT_SETTINGS,

  loadSettings: async () => {
    try {
      const doc = await db.findOneAsync({ type: 'settings_config' });
      if (doc) {
        const { _id, type, ...savedSettings } = doc;
        set({ settings: { ...get().settings, ...savedSettings } });

        applyTheme(savedSettings.theme);
      } else {
        applyTheme(get().settings.theme);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      applyTheme('dark');
    }
  },

  updateSetting: async (key, value) => {
    try {
      const newSettings = { ...get().settings, [key]: value };

      const update = async () => {
        await db.updateAsync(
          { type: 'settings_config' },
          { $set: { ...newSettings, type: 'settings_config' } },
          { upsert: true },
        );
        set({ settings: newSettings });
        if (key === 'theme') applyTheme(value);
      };

      if (key === 'theme') {
        runViewTransition(update);
      } else {
        await update();
      }
    } catch (error) {
      console.error(`Failed to update setting ${key}:`, error);
    }
  },

  initializeDefaultSettings: async () => {
    await db.updateAsync(
      { type: 'settings_config' },
      { $set: { ...DEFAULT_SETTINGS, type: 'settings_config' } },
      { upsert: true },
    );
    set({ settings: DEFAULT_SETTINGS });
    runViewTransition(() => applyTheme(DEFAULT_SETTINGS.theme));
  },
}));

function applyTheme(theme) {
  const root = window.document.documentElement;
  let themeToApply = theme;
  if (theme === 'system') {
    themeToApply = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  if (root.classList.contains(themeToApply)) return;
  root.classList.remove('light', 'dark');
  root.classList.add(themeToApply);
  root.style.colorScheme = themeToApply;
}
