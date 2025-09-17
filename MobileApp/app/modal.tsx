import React from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/components/themed-text';

export default function ModalScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ThemedText style={{ fontSize: 18 }}>Modal Placeholder</ThemedText>
    </View>
  );
}
