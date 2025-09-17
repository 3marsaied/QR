import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ThemedText } from '@/components/themed-text';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      <StatusBar style="dark" />
      <ThemedText className="text-2xl font-bold text-black">Home Screen</ThemedText>
    </View>
  );
}
