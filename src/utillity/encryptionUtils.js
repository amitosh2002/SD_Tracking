import CryptoJS from 'crypto-js';

/**
 * Encrypts a string (e.g., a route) using AES.
 * @param {string} route - The route string to encrypt.
 * @param {string} secretKey - Your secret key for AES encryption.
 * @returns {string} Encrypted route (base64).
 */
export function encryptRoute(route, secretKey) {
  return CryptoJS.AES.encrypt(route, secretKey).toString();
}

/**
 * Decrypts an AES-encrypted route string.
 * @param {string} encryptedRoute - The encrypted route string.
 * @param {string} secretKey - Your secret key for AES decryption.
 * @returns {string} Decrypted route.
 */
export function decryptRoute(encryptedRoute, secretKey) {
  const bytes = CryptoJS.AES.decrypt(encryptedRoute, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}