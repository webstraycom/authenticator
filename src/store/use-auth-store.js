import bcrypt from 'bcryptjs';
import { create } from 'zustand';
import { useSettingsStore, useUIStore } from '@store';
import {
  clearKey,
  decrypt,
  decryptWithHardwareId,
  deriveKey,
  encrypt,
  encryptWithHardwareId,
  generateSalt,
  generateVaultKey,
  initKey,
} from '@utils/crypto';
import { db } from '@utils/db';
import { usePluginStore } from '@sdk';
import { pluginManager } from '@sdk/plugin-manager';

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

      if (sessionDoc?.token && masterDoc?.vaultSalt) {
        const rawVaultKey = decryptWithHardwareId(sessionDoc.token, masterDoc.vaultSalt);

        if (rawVaultKey) {
          initKey(rawVaultKey);
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

      const vaultSalt = generateSalt();
      const rawVaultKey = generateVaultKey();
      const wrappedVaultKey = encrypt(rawVaultKey, deriveKey(password, vaultSalt));

      await db.insertAsync({
        type: 'master_password',
        hash: hashedPassword,
        vaultKey: wrappedVaultKey,
        vaultSalt,
      });

      await useSettingsStore.getState().initializeDefaultSettings();

      const token = encryptWithHardwareId(rawVaultKey, vaultSalt);
      await db.updateAsync(
        { type: 'session' },
        { $set: { token, type: 'session' } },
        { upsert: true },
      );

      initKey(rawVaultKey);
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
    } catch {
      return false;
    }
  },

  changeMasterPassword: async (oldPassword, newPassword) => {
    try {
      const masterDoc = await db.findOneAsync({ type: 'master_password' });

      const isMatch = await bcrypt.compare(oldPassword, masterDoc.hash);
      if (!isMatch) throw new Error('Invalid Master Password');

      const rawVaultKey = decrypt(masterDoc.vaultKey, deriveKey(oldPassword, masterDoc.vaultSalt));
      if (!rawVaultKey) throw new Error('Could not decrypt Vault Key');

      const newSalt = await bcrypt.genSalt(10);
      const newVaultSalt = generateSalt();
      const newHashedPassword = await bcrypt.hash(newPassword, newSalt);
      const newWrappedVaultKey = encrypt(rawVaultKey, deriveKey(newPassword, newVaultSalt));

      await db.updateAsync(
        { type: 'master_password' },
        {
          $set: {
            hash: newHashedPassword,
            vaultKey: newWrappedVaultKey,
            vaultSalt: newVaultSalt,
          },
        },
      );

      const newToken = encryptWithHardwareId(rawVaultKey, newVaultSalt);
      await db.updateAsync({ type: 'session' }, { $set: { token: newToken } });

      initKey(rawVaultKey);
      useUIStore.getState().setVerified();

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  login: async (password) => {
    try {
      const doc = await db.findOneAsync({ type: 'master_password' });
      if (doc && (await bcrypt.compare(password, doc.hash))) {
        const rawVaultKey = decrypt(doc.vaultKey, deriveKey(password, doc.vaultSalt));
        if (!rawVaultKey) return false;

        const token = encryptWithHardwareId(rawVaultKey, doc.vaultSalt);
        await db.updateAsync(
          { type: 'session' },
          { $set: { token, type: 'session' } },
          { upsert: true },
        );

        initKey(rawVaultKey);
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
