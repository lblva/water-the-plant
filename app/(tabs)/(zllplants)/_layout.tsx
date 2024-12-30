import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function Plants() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUserId = async () => {
      const user = await AsyncStorage.getItem('userId');
      if (user) {
        const parsedUser = JSON.parse(user);
        const userId = parsedUser.id;
        setUserId(userId);
      }
    }
    getUserId()  
  }, []);

  if (!userId) {
    return null;
  }


  return (
    <Stack>
      <Stack.Screen name="index"  initialParams={{ userId }} options={{ title: 'all plants', headerShown: false }} />
      <Stack.Screen name="plant details" initialParams={{ userId }} options={{ title: 'plant details', headerShown: false }} />
    </Stack>
  );
}
