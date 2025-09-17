// ...existing code...
import { useColorScheme } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
// ...existing code from (tabs)/explore.tsx will be copied here
export default function ExploreScreen() {
  return (
    <ThemedView className="bd-white">
      <ThemedText className= "text-black">Explore</ThemedText>
    </ThemedView>
  );
}