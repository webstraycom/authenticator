import { db } from '@utils/db';
import { encrypt, decrypt, deriveKey } from '@utils/crypto';

export const migrationService = {
  reencryptAllData: async (oldPassword, oldSalt, newPassword, newSalt) => {
    try {
      const oldKey = deriveKey(oldPassword, oldSalt);
      const newKey = deriveKey(newPassword, newSalt);

      const targetTypes = ['password', 'totp', 'token'];
      const docs = await db.findAsync({ type: { $in: targetTypes } });

      if (docs.length === 0) return { success: true, count: 0 };

      const updates = docs.reduce((acc, doc) => {
        const decrypted = decrypt(doc.value, oldKey);

        if (decrypted !== null) {
          acc.push({
            _id: doc._id,
            newValue: encrypt(decrypted, newKey),
          });
        } else {
          console.warn(`Item ${doc._id} is corrupted or belongs to another key. Skipping...`);
        }
        return acc;
      }, []);

      for (const item of updates) {
        await db.updateAsync({ _id: item._id }, { $set: { value: item.newValue } });
      }

      db.persistence.compactDatafile();

      return {
        success: true,
        count: updates.length,
        skipped: docs.length - updates.length,
      };
    } catch (error) {
      console.error('Migration Service Error:', error);
      return { success: false, error: error.message };
    }
  },
};
