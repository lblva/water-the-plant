import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Clear AsyncStorage to log the user out
      await AsyncStorage.removeItem('userId');
      // Navigate to the root index screen after logout
      router.replace('/index');  // Navigate to the root index screen
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#D5E3C6',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    width: 130,
  },
});
