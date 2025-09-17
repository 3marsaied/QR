import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { TouchableOpacity, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerBackButtonDisplayMode: "minimal" }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="LoginScreen" options={{headerTitle:"Login"}}/>
        <Stack.Screen
          name="Home"
          options={{
            headerTitle: 'Home',
            headerRight: () => {
              const router = useRouter();
              return (
                <TouchableOpacity onPress={() => router.push('/profile' as any)} style={{ marginRight: 12 }}>
                  <Image source={require('../assets/profile.png')} style={{ width: 32, height: 32, borderRadius: 16 }} />
                </TouchableOpacity>
              );
            },
          }}
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
