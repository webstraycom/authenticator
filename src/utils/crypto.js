const crypto = window.nw.require('crypto');
const { machineIdSync } = window.nw.require('node-machine-id');

const ALGORITHM = 'aes-256-gcm';
let ENCRYPTION_KEY = null;

export const deriveKey = (password, salt) => {
  return crypto.scryptSync(password, salt, 32);
};

export const initKey = (password, salt) => {
  ENCRYPTION_KEY = crypto.scryptSync(password, salt, 32);
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
  } catch (e) {
    return null;
  }
};

export const encryptWithHardwareId = (text, salt) => {
  const hardwareId = machineIdSync();
  const key = crypto.scryptSync(hardwareId, salt, 32);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${tag}:${encrypted}`;
};

export const decryptWithHardwareId = (text, salt) => {
  try {
    const key = crypto.scryptSync(machineIdSync(), salt, 32);
    const [ivHex, tagHex, encryptedText] = text.split(':');
    const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(ivHex, 'hex'));
    decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (e) {
    return null;
  }
};
