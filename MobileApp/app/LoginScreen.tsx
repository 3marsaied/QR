import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import "../global.css"

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation', 'Please provide both email and password');
      return;
    }
    setLoading(true);
    try {
      const baseUrl = (await import('../utils/config')).getBaseUrl();
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setLoading(false);
        return Alert.alert('Login Failed', data?.message || 'Invalid credentials');
      }

      const token = data?.token;
      if (!token) {
        setLoading(false);
        return Alert.alert('Login Failed', 'No token returned');
      }

    // Save token and expiry (1 year from now)
    const { saveTokenWithExpiry } = await import('../utils/secureStore');
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    await saveTokenWithExpiry('authToken', token, oneYearFromNow.toISOString());

    setLoading(false);
    router.replace('/Home');
    } catch (err) {
      setLoading(false);
      console.error('Login error:', err);
      Alert.alert('Login Failed', 'Something went wrong');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 bg-white px-6 justify-center">
      <Text className="text-2xl font-bold text-gray-800 mb-4">Welcome back</Text>
      <Text className="text-base text-gray-600 mb-6">Log in to continue to your account</Text>

      <Text className="text-sm text-gray-600 mb-2">Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
      />

      <Text className="text-sm text-gray-600 mb-2">Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Your password"
        secureTextEntry
        className="border border-gray-300 rounded-lg px-4 py-3 mb-6"
      />
      <View className="mb-5 items-end w-full mr-2">
        <TouchableOpacity onPress={() => router.push('/forgot-password' as any)}>
          <Text className="text-lg text-blue-600">Forgot password?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="bg-black py-3 rounded-lg items-center mb-4"
        onPress={handleLogin}
        disabled={loading}
      >
        <Text className="text-white font-semibold text-lg">{loading ? 'Signing in...' : 'Sign In'}</Text>
      </TouchableOpacity>

      <View className="flex-row justify-center">
        <Text className="text-gray-600">Don't have an account?</Text>
        <TouchableOpacity onPress={() => router.push('/signup')}>
          <Text className="text-blue-600 ml-2">Create one</Text>
        </TouchableOpacity>
      </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
