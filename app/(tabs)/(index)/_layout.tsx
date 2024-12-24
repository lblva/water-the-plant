import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';


export default function IndexTabLayout() {

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
        <Stack.Screen name="index" initialParams={{ userId }} options={{ headerShown: false }} />
        <Stack.Screen name="profile" initialParams={{ userId }} options={{ headerShown: false }} />
      </Stack>
  );
}
