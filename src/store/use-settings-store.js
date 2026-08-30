import { create } from 'zustand';
import { db } from '@utils/db';
import { runViewTransition } from '@utils/view-transition';

const DEFAULT_SETTINGS = {
  theme: 'dark',
  style: 'classic',
  verificationTimeout: 5,
  requireVerification: true,
};

export const useSettingsStore = create((set, get) => ({
  settings: { ...DEFAULT_SETTINGS },

  loadSettings: async () => {
    try {
      const doc = await db.findOneAsync({ type: 'settings_config' });

      let mergedSettings = get().settings;
      if (doc) {
        const { _id, type, ...savedSettings } = doc;
        mergedSettings = { ...get().settings, ...savedSettings };
      }

      set({ settings: mergedSettings });
      applyAppearance(mergedSettings);
    } catch (error) {
      console.error('Failed to load settings:', error);
      applyAppearance(DEFAULT_SETTINGS);
    }
  },

  updateSettings: async (updates) => {
    try {
      const updatedSettings = { ...get().settings, ...updates };

      const update = async () => {
        await db.updateAsync(
          { type: 'settings_config' },
          { $set: { ...updatedSettings, type: 'settings_config' } },
          { upsert: true },
        );
        set({ settings: updatedSettings });
        if ('theme' in updates || 'style' in updates) {
          applyAppearance(updatedSettings);
        }
      };

      if ('theme' in updates) {
        runViewTransition(update);
      } else {
        await update();
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  },

  initializeDefaultSettings: async () => {
    await db.updateAsync(
      { type: 'settings_config' },
      { $set: { ...DEFAULT_SETTINGS, type: 'settings_config' } },
      { upsert: true },
    );
    set({ settings: { ...DEFAULT_SETTINGS } });
    applyAppearance(DEFAULT_SETTINGS);
  },
}));

function applyAppearance({ theme, style }) {
  const root = window.document.documentElement;

  let themeToApply = theme;
  if (theme === 'system') {
    themeToApply = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  if (!root.classList.contains(themeToApply)) {
    root.classList.remove('light', 'dark');
    root.classList.add(themeToApply);
    root.style.colorScheme = themeToApply;
  }

  if (root.getAttribute('data-style') !== style) {
    root.setAttribute('data-style', style);
  }
}
