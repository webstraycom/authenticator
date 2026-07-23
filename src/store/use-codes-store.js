import { create } from 'zustand';
import { db } from '@utils/db';
import { encrypt, decrypt } from '@utils/crypto';

export const useCodesStore = create((set, get) => ({
  codes: [],
  isLoading: false,

  loadCodes: async (force = false) => {
    if (!force && get().isLoading) return;
    set({ isLoading: true });
    try {
      const docs = await db.findAsync({ type: 'totp' });
      const decrypted = docs.map((doc) => {
        const decryptedValue = decrypt(doc.value);
        return {
          ...doc,
          value: decryptedValue,
          isCorrupted: decryptedValue === null,
        };
      });
      set({ codes: decrypted });
    } catch (error) {
      console.error('Failed to load codes:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addCode: async (service, account, raw) => {
    try {
      const doc = await db.insertAsync({
        type: 'totp',
        service,
        account,
        value: encrypt(raw),
        createdAt: new Date(),
      });
      set((state) => ({
        codes: [...state.codes, { ...doc, value: raw }],
      }));
    } catch (error) {
      console.error('Failed to add code:', error);
    }
  },

  updateCode: async (id, service, account, raw) => {
    try {
      const data = { type: 'totp', service, account, value: encrypt(raw) };
      await db.updateAsync({ _id: id }, { $set: data }, {});
      set((state) => ({
        codes: state.codes.map((c) => (c._id === id ? { ...c, ...data, value: raw } : c)),
      }));
    } catch (error) {
      console.error('Failed to update code:', error);
    }
  },

  deleteCode: async (id) => {
    try {
      await db.removeAsync({ _id: id }, {});
      set((state) => ({
        codes: state.codes.filter((c) => c._id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete code:', error);
    }
  },
}));
