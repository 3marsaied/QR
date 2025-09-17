import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import "../global.css";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Validation", "Please provide both email and password");
      return;
    }
    setLoading(true);
    try {
      const { getBaseUrl } = await import("../utils/config");
      const baseUrl = getBaseUrl();
      const url = `${baseUrl}/auth/login`;

      console.log("Login URL:", url);

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setLoading(false);
        return Alert.alert("Login Failed", data?.message || "Invalid credentials");
      }

      const token = typeof data?.token === "string" ? data.token : null;
      if (!token) {
        setLoading(false);
        return Alert.alert("Login Failed", "No token returned");
      }

      // Save token with expiry (1 year from now)
      const { saveTokenWithExpiry, getToken } = await import("../utils/secureStore");
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

      await saveTokenWithExpiry("authToken", token, oneYearFromNow.toISOString());

      // Debug check
      const storedToken = await getToken("authToken");
      console.log("Stored Token:", storedToken);

      setLoading(false);
      router.replace("/Home");
    } catch (err) {
      setLoading(false);
      console.error("Login error:", err);
      Alert.alert("Login Failed", "Something went wrong");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            paddingHorizontal: 24,
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#1f2937", marginBottom: 16 }}>
            Welcome back
          </Text>
          <Text style={{ fontSize: 16, color: "#4b5563", marginBottom: 24 }}>
            Log in to continue to your account
          </Text>

          <Text style={{ fontSize: 14, color: "#4b5563", marginBottom: 8 }}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            style={{
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 12,
              marginBottom: 16,
            }}
          />

          <Text style={{ fontSize: 14, color: "#4b5563", marginBottom: 8 }}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Your password"
            secureTextEntry
            style={{
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 12,
              marginBottom: 24,
            }}
          />

          <View style={{ marginBottom: 20, alignItems: "flex-end", width: "100%", marginRight: 8 }}>
            <TouchableOpacity onPress={() => router.push("/forgot-password" as any)}>
              <Text style={{ fontSize: 18, color: "#2563eb" }}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: "#000",
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: "center",
              marginBottom: 16,
            }}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 18 }}>
              {loading ? "Signing in..." : "Sign In"}
            </Text>
          </TouchableOpacity>

          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={{ color: "#4b5563" }}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push("./signup")}>
              <Text style={{ color: "#2563eb", marginLeft: 8 }}>Create one</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
