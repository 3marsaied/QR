import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import "../global.css";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email) {
      return Alert.alert('Validation', 'Please enter your email');
    }

    setLoading(true);
    try {
      const baseUrl = (await import('../utils/config')).getBaseUrl();
      const url = `${baseUrl}/auth/forgot-password`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        return Alert.alert('Error', data?.message || 'Failed to send reset email');
      }

  Alert.alert('Success', data?.message || 'OTP sent to your email. It will expire in a minute.');
  // Navigate to reset-password page with email in query params so user can enter OTP and new password
  router.replace(`/reset-password?email=${encodeURIComponent(email)}` as any);
    } catch (err) {
      setLoading(false);
      console.error('Forgot password error:', err);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 bg-white px-6 justify-center">
      <Text className="text-2xl font-bold text-gray-800 mb-4">Forgot Password</Text>
      <Text className="text-base text-gray-600 mb-6">Enter your email and we'll send you instructions to reset your password.</Text>

      <Text className="text-sm text-gray-600 mb-2">Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        className="border border-gray-300 rounded-lg px-4 py-3 mb-6"
      />

      <TouchableOpacity
        className="bg-black py-3 rounded-lg items-center mb-4"
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold text-lg">Send OTP</Text>
        )}
      </TouchableOpacity>

      <View className="flex-row justify-center">
        <Text className="text-gray-600">Remembered your password?</Text>
        <TouchableOpacity onPress={() => router.replace('/LoginScreen' as any)}>
          <Text className="text-blue-600 ml-2">Back to Login</Text>
        </TouchableOpacity>
      </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
