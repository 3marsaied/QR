import React, { useEffect, useState } from 'react';
import { TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ParamListBase } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import '../global.css';

type Props = {
  navigation?: NativeStackNavigationProp<ParamListBase>;
};

export default function WelcomeScreen({ navigation }: Props) {
  const [checking, setChecking] = useState(true);
  const [foundToken, setFoundToken] = useState<string | undefined>(undefined);
  // If this component is rendered without a navigation prop (e.g. by a wrapper),
  // fall back to the hook so handlers still work.
  const nav = (navigation as any) ?? (useNavigation() as any);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { getToken } = await import('../utils/secureStore');
        const token = await getToken('authToken');
        if (mounted && token) setFoundToken(token);
      } catch (err) {
        console.error('Error checking token', err);
      } finally {
        if (mounted) setChecking(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [navigation]);

  if (checking) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </ThemedView>
    );
  }

  return (
    <View className="flex-1 justify-center items-center px-6 bg-white">
      <ThemedText type="title" className="text-3xl font-bold mb-2 text-black">
        Welcome to QR App!
      </ThemedText>
      <ThemedText className="text-lg mb-10 text-center text-gray-600">
        Please login or sign up to continue.
      </ThemedText>

      {foundToken ? (
        <View className="mb-8 items-center w-full">
          <ThemedText className="text-xs text-gray-500">
            Found auth token (masked):
          </ThemedText>
          <ThemedText className="text-xs my-2 text-black">
            {foundToken.length > 30
              ? `${foundToken.slice(0, 20)}...${foundToken.slice(-10)}`
              : foundToken}
          </ThemedText>

          <View className="flex-row space-x-3 mt-3">
            <TouchableOpacity
              className="bg-black py-2 px-4 rounded-lg"
              onPress={() => {
                router.replace('/Home');
              }}
            >
              <ThemedText className="text-white font-medium">
                Proceed to Home
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-gray-200 py-2 px-4 rounded-lg"
              onPress={async () => {
                const { deleteToken } = await import('../utils/secureStore');
                await deleteToken('authToken');
                setFoundToken(undefined);
              }}
            >
              <ThemedText className="text-black font-medium">
                Clear token
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      <View className="flex-row space-x-4 justify-center mb-5 w-[80%]">
        <TouchableOpacity
          className="bg-black py-3 px-8 rounded-xl w-full items-center"
          onPress={() => {
            router.push('/LoginScreen');
          }}
        >
          <ThemedText className="text-white text-lg font-semibold">
            Login
          </ThemedText>
        </TouchableOpacity>
      </View>

      <View className="flex-row space-x-4 justify-center w-[80%]">
        <TouchableOpacity
          className="bg-black py-3 px-8 rounded-xl w-full items-center"
          onPress={() => {
            router.push('/signup');
          }}
        >
          <ThemedText className="text-white text-lg font-semibold">
            Sign Up
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
