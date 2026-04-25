import { db } from '@utils/db';
import { encrypt, decrypt, deriveKey } from '@utils/crypto';
const crypto = window.nw.require('crypto');

export const dataService = {
  previewImport: async (file, targetType = null) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const rawData = JSON.parse(e.target.result);

          if (!rawData.data || !Array.isArray(rawData.data)) {
            throw new Error("Invalid format: 'data' array is missing");
          }

          const dataArray = rawData.data;
          const salt = rawData.salt || null;

          const filtered = targetType
            ? dataArray.filter((item) => item.type === targetType)
            : dataArray;

          const stats = filtered.reduce((acc, item) => {
            acc[item.type] = (acc[item.type] || 0) + 1;
            return acc;
          }, {});

          resolve({
            data: filtered,
            stats,
            total: filtered.length,
            salt: salt,
          });
        } catch (err) {
          reject(new Error('Invalid JSON File'));
        }
      };
      reader.readAsText(file);
    });
  },

  importData: async (dataArray, importPassword, salt) => {
    try {
      const fileKey = salt && importPassword ? deriveKey(importPassword, salt) : null;
      const preparedDocs = dataArray
        .filter((item) => item.value || item.secret || item.token)
        .map((item) => {
          const { _id, secret, token, value, expires, ...rest } = item;
          const rawValue = item.value || item.secret || item.token;
          const decryptedValue = fileKey ? decrypt(rawValue, fileKey) : null;

          const parseDate = (dateVal) => {
            if (!dateVal || dateVal === 'null') return null;
            let val = dateVal.$$date !== undefined ? dateVal.$$date : dateVal;
            if (typeof val === 'string' && /^\d+$/.test(val)) val = Number(val);
            const d = new Date(val);
            return isNaN(d.getTime()) ? null : d;
          };

          const finalValue = decryptedValue !== null ? encrypt(decryptedValue) : rawValue;

          return {
            ...rest,
            value: finalValue,
            expires: parseDate(expires),
            createdAt: new Date(),
          };
        });

      const result = await db.insertAsync(preparedDocs);
      return { success: true, count: Array.isArray(result) ? result.length : 1 };
    } catch (err) {
      console.error('Save Error:', err);
      return { success: false, error: err.message };
    }
  },

  previewExport: async (targetType = null) => {
    try {
      const allowedTypes = ['password', 'totp', 'token'];
      const query = targetType ? { type: targetType } : { type: { $in: allowedTypes } };

      const dataArray = await db.findAsync(query);

      const stats = dataArray.reduce((acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
      }, {});

      return {
        data: dataArray,
        stats,
        total: dataArray.length,
      };
    } catch (err) {
      throw new Error('Failed to read database');
    }
  },

  exportData: async (dataArray, exportPassword) => {
    try {
      if (!exportPassword) throw new Error('Export password is required');

      const salt = crypto.randomBytes(16).toString('hex');
      const fileKey = deriveKey(exportPassword, salt);

      const preparedDocs = dataArray.map(({ _id, expires, ...item }) => {
        const decrypted = decrypt(item.value);
        return {
          ...item,
          value: decrypted !== null ? encrypt(decrypted, fileKey) : item.value,
          ...(item.type === 'token' && { expires }),
        };
      });

      const exportPayload = {
        data: preparedDocs,
        salt,
        exportedAt: new Date().toISOString(),
      };

      const handle = await window.showSaveFilePicker({
        suggestedName: `authenticator-backup-${Date.now()}.json`,
        types: [{ accept: { 'application/json': ['.json'] } }],
      });
      const writable = await handle.createWritable();
      await writable.write(JSON.stringify(exportPayload, null, 2));
      await writable.close();

      return { success: true, count: preparedDocs.length };
    } catch (err) {
      if (err.name === 'AbortError') {
        return { success: false, error: 'Cancelled' };
      }
      return { success: false, error: err.message };
    }
  },
};
