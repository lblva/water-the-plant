import { Image, StyleSheet, Text, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor'; 
import ToWater from '@/components/towater';

export default function HomeScreen() {
  // Use the theme to set the background color dynamically
  const backgroundColor = useThemeColor({}, 'background');
  
  return (
    <SafeAreaView style={[styles.mainContainer, { backgroundColor }]}>
      <ThemedText type="defaultSemiBold">Goodmorning, user</ThemedText>
      <ToWater />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mainContainer: {
    flex: 1,
    padding: 25, // Apply 15px padding to the entire screen
  }
});
