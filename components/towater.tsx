import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
export default function ToWater() {
  return (
    <View>
      <ThemedText type="defaultSemiBold">To water</ThemedText>
      <View style={styles.container}>
        <ThemedText type="defaultSemiBold">test</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: 'rgba(232, 239, 225, 1)',
    }
  });
  