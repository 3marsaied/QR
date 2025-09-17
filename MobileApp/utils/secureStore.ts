import * as SecureStore from 'expo-secure-store';

export async function saveToken(key: string, value: string) {
  await SecureStore.setItemAsync(key, value, {
    keychainService: 'myAppKeychain',
  });
}

/**
 * Save a token and its expiry timestamp (ISO string) under separate keys.
 * tokenKey will store the token, expiryKey will be `${tokenKey}_expiry`.
 */
export async function saveTokenWithExpiry(key: string, value: string, expiresAtIso: string) {
  await SecureStore.setItemAsync(key, value, { keychainService: 'myAppKeychain' });
  await SecureStore.setItemAsync(`${key}_expiry`, expiresAtIso, { keychainService: 'myAppKeychain' });
}

export async function getToken(key: string) {
  return await SecureStore.getItemAsync(key);
}

/**
 * Retrieve token and expiry (ISO string). Returns { token, expiresAt }
 */
export async function getTokenWithExpiry(key: string): Promise<{ token: string | null; expiresAt: string | null }> {
  const token = await SecureStore.getItemAsync(key);
  const expiresAt = await SecureStore.getItemAsync(`${key}_expiry`);
  return { token, expiresAt };
}

export async function deleteToken(key: string) {
  await SecureStore.deleteItemAsync(key);
  await SecureStore.deleteItemAsync(`${key}_expiry`);
}
