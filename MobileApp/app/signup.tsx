import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import "../global.css";

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password || !firstName || !lastName) {
      return Alert.alert('Validation', 'Please fill all fields');
    }
    setLoading(true);
    try {
      const baseUrl = (await import('../utils/config')).getBaseUrl();
      const res = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setErrorMessage(data?.message || 'Registration failed');
        return;
      }

      Alert.alert('Success', data?.message || 'Registered successfully');
      router.replace('/LoginScreen' as any);
    } catch (err) {
      setLoading(false);
      console.error('Registration error:', err);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 bg-white px-6 justify-center">
          <Text className="text-2xl font-bold text-gray-800 mb-4">Create an account</Text>
          <Text className="text-base text-gray-600 mb-6">Sign up to get started.</Text>

          <Text className="text-sm text-gray-600 mb-2">First name</Text>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First name"
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
          />

          <Text className="text-sm text-gray-600 mb-2">Last name</Text>
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last name"
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
          />

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
            placeholder="Password"
            secureTextEntry
            className="border border-gray-300 rounded-lg px-4 py-3 mb-6"
          />

          {errorMessage ? (
            <Text className="text-sm text-red-600 mb-4">{errorMessage}</Text>
          ) : null}

          <TouchableOpacity
            className="bg-black py-3 rounded-lg items-center mb-4"
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-lg">Sign Up</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center">
            <Text className="text-gray-600">Already have an account?</Text>
            <TouchableOpacity onPress={() => router.replace('/LoginScreen' as any)}>
              <Text className="text-blue-600 ml-2">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
