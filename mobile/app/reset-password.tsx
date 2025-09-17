import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import "../global.css";

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams();
  const emailParam = params.email as string | undefined;
  const [email, setEmail] = useState(emailParam || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (emailParam) setEmail(emailParam as string);
  }, [emailParam]);

  const handleReset = async () => {
    if (!email || !otp || !newPassword) {
      return Alert.alert('Validation', 'Please fill all fields');
    }

    setLoading(true);
    try {
      const baseUrl = (await import('../utils/config')).getBaseUrl();
      const res = await fetch(`${baseUrl}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        // show server message inline when possible
        setErrorMessage(data?.message || 'Failed to reset password');
        return;
      }

      Alert.alert('Success', data?.message || 'Password reset successful');
      router.replace('/LoginScreen' as any);
    } catch (err) {
      setLoading(false);
      console.error('Reset password error:', err);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 bg-white px-6 justify-center">
      <Text className="text-2xl font-bold text-gray-800 mb-4">Reset Password</Text>
      <Text className="text-base text-gray-600 mb-6">Enter your email, OTP and new password.</Text>

      <Text className="text-sm text-gray-600 mb-2">Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
      />

      <Text className="text-sm text-gray-600 mb-2">OTP</Text>
      <TextInput
        value={otp}
        onChangeText={setOtp}
        placeholder="123456"
        keyboardType="numeric"
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
      />

      <Text className="text-sm text-gray-600 mb-2">New Password</Text>
      <TextInput
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="New password"
        secureTextEntry
        className="border border-gray-300 rounded-lg px-4 py-3 mb-6"
      />

      <TouchableOpacity
        className="bg-black py-3 rounded-lg items-center mb-4"
        onPress={handleReset}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold text-lg">Reset Password</Text>
        )}
      </TouchableOpacity>

      <View className="flex-row justify-center">
        <TouchableOpacity onPress={() => router.replace('/login' as any)}>
          <Text className="text-blue-600">Back to Login</Text>
        </TouchableOpacity>
      </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
