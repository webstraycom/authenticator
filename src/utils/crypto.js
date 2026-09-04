const crypto = window.nw.require('crypto');
const { machineIdSync } = window.nw.require('node-machine-id');

const ALGORITHM = 'aes-256-gcm';
let ENCRYPTION_KEY = null;

export const generateSalt = () => {
  return crypto.randomBytes(16).toString('hex');
};

export const generateVaultKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const deriveKey = (password, salt) => {
  return crypto.scryptSync(password, salt, 32);
};

export const initKey = (vaultKey) => {
  ENCRYPTION_KEY = Buffer.isBuffer(vaultKey) ? vaultKey : Buffer.from(vaultKey, 'hex');
};

export const clearKey = () => {
  ENCRYPTION_KEY = null;
};

export const encrypt = (text, customKey = null) => {
  const key = customKey || ENCRYPTION_KEY;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${tag}:${encrypted}`;
};

export const decrypt = (text, customKey = null) => {
  const key = customKey || ENCRYPTION_KEY;
  try {
    const [ivHex, tagHex, encryptedText] = text.split(':');
    const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(ivHex, 'hex'));
    decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch {
    return null;
  }
};

export const encryptWithHardwareId = (text, salt) => {
  try {
    const hardwareId = machineIdSync();
    const key = deriveKey(hardwareId, salt);
    return encrypt(text, key);
  } catch {
    return null;
  }
};

export const decryptWithHardwareId = (text, salt) => {
  try {
    const hardwareId = machineIdSync();
    const key = deriveKey(hardwareId, salt);
    return decrypt(text, key);
  } catch {
    return null;
  }
};
