import { create } from 'zustand';
import { db } from '@utils/db';
import { initKey, clearKey, encryptWithHardwareId, decryptWithHardwareId } from '@utils/crypto';
import bcrypt from 'bcryptjs';
import { useUIStore, useSettingsStore } from '@store';
import { migrationService } from '@utils/migrationService';
import { usePasswordsStore, useCodesStore, useTokensStore } from '@store';
import { pluginManager } from '@sdk/PluginManager';
import { usePluginStore } from '@sdk';

export const useAuthStore = create((set) => ({
  isInitialized: false,
  isAuthenticated: null,

  checkAuth: async () => {
    try {
      const [masterDoc, sessionDoc] = await Promise.all([
        db.findOneAsync({ type: 'master_password' }),
        db.findOneAsync({ type: 'session' }),
      ]);

      set({ isInitialized: !!masterDoc });

      if (sessionDoc?.token) {
        const masterPassword = decryptWithHardwareId(sessionDoc.token, masterDoc.hash);

        if (masterPassword) {
          initKey(masterPassword, masterDoc.hash);
          set({ isAuthenticated: true });
          pluginManager.init();
          pluginManager.startWatcher();
          return;
        }
      }

      set({ isAuthenticated: false });
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  },

  setupMasterPassword: async (password) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await db.insertAsync({ type: 'master_password', hash: hashedPassword });

      await useSettingsStore.getState().initializeDefaultSettings();

      const token = encryptWithHardwareId(password, hashedPassword);
      await db.updateAsync(
        { type: 'session' },
        { $set: { token, type: 'session' } },
        { upsert: true },
      );

      initKey(password, hashedPassword);

      set({ isInitialized: true, isAuthenticated: true });
      pluginManager.init();
      pluginManager.startWatcher();
      useUIStore.getState().setVerified();
      return true;
    } catch (error) {
      console.error('Setup failed:', error);
      return false;
    }
  },

  verifyMasterPassword: async (password) => {
    try {
      const doc = await db.findOneAsync({ type: 'master_password' });
      if (!doc) return false;
      return await bcrypt.compare(password, doc.hash);
    } catch (error) {
      return false;
    }
  },

  changeMasterPassword: async (oldPassword, newPassword) => {
    try {
      const masterDoc = await db.findOneAsync({ type: 'master_password' });

      const isMatch = await bcrypt.compare(oldPassword, masterDoc.hash);

      if (!isMatch) {
        return { success: false, error: 'Invalid Master Password' };
      }

      const newSalt = await bcrypt.genSalt(10);
      const newHashedPassword = await bcrypt.hash(newPassword, newSalt);

      const migration = await migrationService.reencryptAllData(
        oldPassword,
        masterDoc.hash,
        newPassword,
        newHashedPassword,
      );

      if (!migration.success) throw new Error(migration.error);

      await db.updateAsync({ type: 'master_password' }, { $set: { hash: newHashedPassword } });

      const newToken = encryptWithHardwareId(newPassword, newHashedPassword);
      await db.updateAsync({ type: 'session' }, { $set: { token: newToken } });

      initKey(newPassword, newHashedPassword);
      useUIStore.getState().setVerified();

      await Promise.all([
        usePasswordsStore.getState().loadPasswords(true),
        useCodesStore.getState().loadCodes(true),
        useTokensStore.getState().loadTokens(true),
      ]);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  login: async (password) => {
    try {
      const doc = await db.findOneAsync({ type: 'master_password' });
      if (!doc) return false;

      const isMatch = await bcrypt.compare(password, doc.hash);

      if (isMatch) {
        const token = encryptWithHardwareId(password, doc.hash);
        await db.updateAsync(
          { type: 'session' },
          { $set: { token, type: 'session' } },
          { upsert: true },
        );

        initKey(password, doc.hash);

        set({ isAuthenticated: true });
        pluginManager.init();
        pluginManager.startWatcher();
        useUIStore.getState().setVerified();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },

  logout: async () => {
    try {
      await db.removeAsync({ type: 'session' }, { multi: true });
      clearKey();
      set({ isAuthenticated: false });
      pluginManager.stopWatcher();
      usePluginStore.getState().disableAllPlugins();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  },

  resetAuth: () => {
    clearKey();
    set({
      isInitialized: false,
      isAuthenticated: false,
    });
  },
}));
