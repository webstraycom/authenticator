import { create } from 'zustand';
import { db } from '@utils/db';
import { encrypt, decrypt } from '@utils/crypto';

export const useTokensStore = create((set, get) => ({
  tokens: [],
  isLoading: false,

  loadTokens: async (force = false) => {
    if (!force && get().isLoading) return;
    set({ isLoading: true });
    try {
      const docs = await db.findAsync({ type: 'token' });
      const decrypted = docs.map((doc) => {
        const decryptedValue = decrypt(doc.value);
        return {
          ...doc,
          value: decryptedValue,
          isCorrupted: decryptedValue === null,
        };
      });
      set({ tokens: decrypted });
    } catch (error) {
      console.error('Failed to load tokens:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addToken: async (service, endpoint, raw, expires) => {
    try {
      const doc = await db.insertAsync({
        type: 'token',
        service,
        endpoint,
        expires,
        value: encrypt(raw),
        createdAt: new Date(),
      });

      set((state) => ({
        tokens: [...state.tokens, { ...doc, value: raw }],
      }));
    } catch (error) {
      console.error('Failed to add token:', error);
    }
  },

  updateToken: async (id, service, endpoint, raw, expires) => {
    try {
      const data = {
        type: 'token',
        service,
        endpoint,
        expires,
        value: encrypt(raw),
      };

      await db.updateAsync({ _id: id }, { $set: data }, {});

      set((state) => ({
        tokens: state.tokens.map((t) => (t._id === id ? { ...t, ...data, value: raw } : t)),
      }));
    } catch (error) {
      console.error('Failed to update token:', error);
    }
  },

  deleteToken: async (id) => {
    try {
      await db.removeAsync({ _id: id }, {});
      set((state) => ({
        tokens: state.tokens.filter((t) => t._id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete token:', error);
    }
  },
}));
