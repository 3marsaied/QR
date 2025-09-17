import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function Home() {
  const [uuid, setUuid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);
  const router = useRouter();

  const fetchUser = async () => {
    setUserLoading(true);
    setUserError(null);
    try {
      const { getBaseUrl } = await import("../utils/config");
      const baseUrl = getBaseUrl();
      const { getToken } = await import("../utils/secureStore");
      const token = await getToken("authToken");
      if (!token) {
        router.replace("/LoginScreen");
        return;
      }
      const res = await fetch(`${baseUrl}/auth/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setUserError(data?.message || "Failed to fetch user info");
        setUser(null);
      } else {
        setUser(data.user);
      }
    } catch (err) {
      setUserError("Error fetching user info");
      setUser(null);
    } finally {
      setUserLoading(false);
    }
  };

  const fetchUuid = async () => {
    setLoading(true);
    setError(null);
    try {
      const { getBaseUrl } = await import("../utils/config");
      const baseUrl = getBaseUrl();
      const { getToken } = await import("../utils/secureStore");
      const token = await getToken("authToken");
      if (!token) {
        router.replace("/LoginScreen");
        return;
      }
      const res = await fetch(`${baseUrl}/qr/current`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || "Failed to fetch UUID");
        setUuid(null);
      } else {
        setUuid(data.uuid);
      }
    } catch (err) {
      setError("Error fetching UUID");
      setUuid(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchUuid();
    const interval = setInterval(fetchUuid, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white p-6">
      {/* User Info Card */}
      <View className="w-full bg-gray-100 rounded-xl p-4 mb-6 shadow-md">
        <Text className="text-lg font-bold text-gray-800 mb-2">User Info</Text>
        {userLoading ? (
          <ActivityIndicator size="small" color="#2563eb" />
        ) : userError ? (
          <Text className="text-red-500 text-base mb-2">{userError}</Text>
        ) : user ? (
          <View>
            {Object.entries(user).map(([key, value]) => (
              <View key={key} className="flex-row mb-1">
                <Text className="font-semibold text-gray-700 mr-2">{key}:</Text>
                <Text className="text-gray-700">{String(value)}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text className="text-gray-500">No user info available</Text>
        )}
      </View>

      <Text className="text-xl font-bold text-gray-900 mb-6 text-center">
        Your QR Code (refreshes every minute)
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" />
      ) : error ? (
        <Text className="text-red-500 text-base mb-4">{error}</Text>
      ) : uuid ? (
        <>
          <QRCode value={uuid} size={220} backgroundColor="#fff" color="#000" />
          <Text className="mt-6 text-gray-600 text-sm text-center">{uuid}</Text>
        </>
      ) : (
        <Text className="text-red-500 text-base">No UUID available</Text>
      )}

      {/* Floating Logout Button */}
      <TouchableOpacity
        className="absolute bottom-8 right-8 bg-red-600 rounded-full p-4 shadow-lg"
        style={{ elevation: 5 }}
        onPress={async () => {
          const { deleteToken } = await import("../utils/secureStore");
          await deleteToken("authToken");
          router.replace("/WelcomeScreen");
        }}
        activeOpacity={0.85}
      >
        <Text className="text-white font-bold text-lg">Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}
