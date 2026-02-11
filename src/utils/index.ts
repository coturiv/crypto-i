import * as CryptoJS from 'crypto-js';

export const VERSION = 'v2';
export const ITERATIONS = 200000;
export const AES_KEY_BIT_SIZE = 256;
export const HMAC_KEY_BIT_SIZE = 256;

export const constantTimeEqual = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
};

export const deriveKeys = (password: string, salt: CryptoJS.lib.WordArray) => {
  // Derive a master key. Always use 256-bit for AES and 256-bit for HMAC
  const totalNeededBits = AES_KEY_BIT_SIZE + HMAC_KEY_BIT_SIZE;
  
  const masterKey = CryptoJS.PBKDF2(password, salt, {
    keySize: totalNeededBits / 32,
    iterations: ITERATIONS,
    hasher: CryptoJS.algo.SHA256,
  });

  const aesKeyWords = AES_KEY_BIT_SIZE / 32;
  const hmacKeyWords = HMAC_KEY_BIT_SIZE / 32;

  // Split into encryption key and hmac key
  const encryptionKey = CryptoJS.lib.WordArray.create(
    masterKey.words.slice(0, aesKeyWords), AES_KEY_BIT_SIZE / 8
  );

  const hmacKey = CryptoJS.lib.WordArray.create(
    masterKey.words.slice(aesKeyWords, aesKeyWords + hmacKeyWords), HMAC_KEY_BIT_SIZE / 8
  );

  return { encryptionKey, hmacKey };
};

export const encrypt = (message = '', password = '') => {
  const salt = CryptoJS.lib.WordArray.random(16);
  const iv = CryptoJS.lib.WordArray.random(16);

  const { encryptionKey, hmacKey } = deriveKeys(password, salt);

  const encrypted = CryptoJS.AES.encrypt(message, encryptionKey, { iv });
  const ciphertext = encrypted.ciphertext;

  const hmac = CryptoJS.HmacSHA256(ciphertext, hmacKey);

  return [
    VERSION,
    salt.toString(CryptoJS.enc.Base64),
    iv.toString(CryptoJS.enc.Base64),
    ciphertext.toString(CryptoJS.enc.Base64),
    hmac.toString(CryptoJS.enc.Base64),
  ].join(':');
};

export const decrypt = (payload = '', password = '') => {
  const parts = payload.split(':');
  const version = parts[0];

  // Supporting v2 (current) and v3 (temporary transition version)
  if (version === 'v2' || version === 'v3') {
    let saltB64, ivB64, cipherB64, hmacB64;

    if (parts.length === 5) {
      [, saltB64, ivB64, cipherB64, hmacB64] = parts;
    } else if (parts.length === 6) {
      // Compatibility for temporary transition payloads
      saltB64 = parts[2];
      ivB64 = parts[3];
      cipherB64 = parts[4];
      hmacB64 = parts[5];
    } else {
      throw new Error('Invalid payload');
    }

    const salt = CryptoJS.enc.Base64.parse(saltB64);
    const iv = CryptoJS.enc.Base64.parse(ivB64);
    const ciphertext = CryptoJS.enc.Base64.parse(cipherB64);
    const receivedHmacHex = CryptoJS.enc.Base64.parse(hmacB64)
      .toString(CryptoJS.enc.Hex);

    const { encryptionKey, hmacKey } = deriveKeys(password, salt);

    const calculatedHmacHex = CryptoJS.HmacSHA256(ciphertext, hmacKey)
      .toString(CryptoJS.enc.Hex);

    if (!constantTimeEqual(calculatedHmacHex, receivedHmacHex)) {
      throw new Error('Invalid password or corrupted data');
    }

    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext } as any,
      encryptionKey,
      { iv }
    );

    const result = decrypted.toString(CryptoJS.enc.Utf8);
    if (!result) throw new Error('Invalid password or corrupted data');

    return result;
  } else {
    throw new Error('Unsupported version');
  }
};
