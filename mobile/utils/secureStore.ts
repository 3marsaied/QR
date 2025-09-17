// utils/secureStore.ts
import * as SecureStore from 'expo-secure-store';

export async function saveTokenWithExpiry(key: string, token: string, expiry: string) {
  const value = JSON.stringify({ token, expiry });
  await SecureStore.setItemAsync(key, value);
}

export async function getToken(key: string) {
  const value = await SecureStore.getItemAsync(key);
  if (!value) return null;

  try {
    const { token, expiry } = JSON.parse(value);
    if (expiry && new Date(expiry) < new Date()) {
      // expired
      await SecureStore.deleteItemAsync(key);
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

export async function deleteToken(key: string) {
  await SecureStore.deleteItemAsync(key);
}
