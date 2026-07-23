import { create } from 'zustand';
import { db } from '@utils/db';
import { encrypt, decrypt } from '@utils/crypto';

export const usePasswordsStore = create((set, get) => ({
  passwords: [],
  isLoading: false,

  loadPasswords: async (force = false) => {
    if (!force && get().isLoading) return;
    set({ isLoading: true });
    try {
      const docs = await db.findAsync({ type: 'password' });
      const decrypted = docs.map((doc) => {
        const decryptedValue = decrypt(doc.value);
        return {
          ...doc,
          value: decryptedValue,
          isCorrupted: decryptedValue === null,
        };
      });
      set({ passwords: decrypted });
    } catch (error) {
      console.error('Failed to load passwords:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addPassword: async (site, login, raw) => {
    try {
      const doc = await db.insertAsync({
        type: 'password',
        site,
        login,
        value: encrypt(raw),
        createdAt: new Date(),
      });

      set((state) => ({
        passwords: [...state.passwords, { ...doc, value: raw }],
      }));
    } catch (error) {
      console.error('Failed to add password:', error);
    }
  },

  updatePassword: async (id, site, login, raw) => {
    try {
      const data = { type: 'password', site, login, value: encrypt(raw) };
      await db.updateAsync({ _id: id }, { $set: data }, {});

      set((state) => ({
        passwords: state.passwords.map((p) => (p._id === id ? { ...p, ...data, value: raw } : p)),
      }));
    } catch (error) {
      console.error('Failed to update password:', error);
    }
  },

  deletePassword: async (id) => {
    try {
      await db.removeAsync({ _id: id }, {});
      set((state) => ({
        passwords: state.passwords.filter((p) => p._id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete password:', error);
    }
  },
}));
